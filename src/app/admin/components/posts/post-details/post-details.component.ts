import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {Post} from '../../../../shared/models/post';
import {BehaviorSubject, from, merge, Observable, of, throwError, zip} from 'rxjs';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {catchError, concatMap, filter, finalize, map, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {NotificationService} from '../../../../shared/services/notification.service';
import {CompressorService} from '../../../services/compressor.service';
import {AuthService} from '../../../services/auth.service';
import {FireStorageService} from '../../../services/fire-storage.service';
import {PostsManagerService} from '../../../../shared/services/posts-manager.service';
import {UploadFileData} from '../../user-file-upload/user-file-upload.component';
import {SpinnerService} from '../../../services/spinner.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {MediaLibraryModalComponent} from '../media-library-modal/media-library-modal.component';
import {UserDataManagerService} from '../../../../shared/services/user-data-manager.service';

export interface UploadQuery {
	[key: string]: UploadItem;
}

export interface UploadItem {
	source?: string;
	file?: File;
	path?: string;
}

@Component({
	selector: 'app-post-details',
	templateUrl: './post-details.component.html',
	styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent extends BaseObserverComponent implements OnInit, OnDestroy {
	constructor(
		private router: Router,
		private fb: FormBuilder,
		private notificationService: NotificationService,
		private compressor: CompressorService,
		private authService: AuthService,
		private storage: FireStorageService,
		private postManager: PostsManagerService,
		private route: ActivatedRoute,
		private spinnerService: SpinnerService,
		private modalService: ModalService,
		private userService: UserDataManagerService
	) {
		super();
		const navigation = this.router.getCurrentNavigation();
		if (navigation.extras.state as Post) {
			this.post.next(navigation.extras.state as Post);
		}
	}
	post: BehaviorSubject<Post> = new BehaviorSubject(undefined);
	postForm: FormGroup;
	isLoading$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	filesPendingForUpload: UploadQuery = {};

	private static getPath(postId: string, file: File): string {
		return `posts/${postId}/${file.name}`;
	}

	ngOnInit() {
		this.initForm();
		// this.userService.userInfo$
		// 	.pipe(
		// 		take(1),
		// 		tap(user => {
		const modalRef = this.modalService.open(MediaLibraryModalComponent, null, {size: 'lg'});
		// 		})
		// 	)
		// 	.subscribe();

		if (!this.post.value) {
			this.route.params
				.pipe(
					switchMap(params => {
						if (params['id'] && params['id'] !== 'new') {
							this.isLoading$.next('Loading...');
							return this.postManager.getPost(params['id']);
						}
						return of(null);
					}),
					takeUntil(this.destroy$)
				)
				.subscribe(post => {
					console.log('Function: , post: ', post);
					this.isLoading$.next(null);
					this.post.next(post);
				});
		}
		this.post
			.asObservable()
			.pipe(
				filter(post => !!post),
				takeUntil(this.destroy$)
			)
			.subscribe(post => this.prePopulateForm(post));
	}

	private initForm() {
		this.postForm = this.fb.group({
			title: ['', [Validators.required]],
			description: ['', [Validators.required]],
			role: ['', []],
			timeline: ['', []],
			mediumLink: ['', []],
			prototypeLink: ['', []],
			headerImg: ['', []],
			thumbImg: ['', []]
		});

		merge(
			this.postForm.get('thumbImg').valueChanges.pipe(
				filter(item => item && !!item.file),
				map(({file}) => {
					return {source: 'thumbImg', file} as UploadItem;
				})
			),
			this.postForm.get('headerImg').valueChanges.pipe(
				filter(item => item && !!item.file),
				map(({file}) => {
					return {source: 'headerImg', file} as UploadItem;
				})
			)
		)
			.pipe(
				map(object => {
					const {file, source} = {...object};
					if (file) {
						Object.defineProperty(file, 'name', {
							writable: true,
							value: file.name.replace(/^.*(?=\.)/g, source)
						});
					}
					object.file = file;
					return object;
				}),
				takeUntil(this.destroy$)
			)
			.subscribe(result => {
				this.filesPendingForUpload[result.source] = result;
				if (result && !result.file) {
					delete this.filesPendingForUpload[result.source];
				}
				if (this.postForm.get(result.source).hasError('invalid')) {
					this.notificationService.showError({
						message: 'Unsupported file type. Select only image files',
						duration: 5000,
						enableClose: true
					});
					this.postForm.get(result.source).setValue(null, {emitEvent: false});
				}
			});

		this.postForm
			.get('headerImg')
			.valueChanges.pipe(
				tap(item => console.log('Function: , item: ', item)),
				filter(item => item && !!item.file),
				switchMap(item => {
					if (this.postForm.get('headerImg').valid && !this.postForm.get('thumbImg').value) {
						return this.compressor
							.compress(item.file, 600)
							.pipe(
								tap(compressedFile =>
									this.postForm.get('thumbImg').setValue({file: compressedFile}, {emitEvent: false})
								)
							);
					} else {
						return of(item);
					}
				}),
				takeUntil(this.destroy$)
			)
			.subscribe(() => {}, err => console.log('error compressing file: ', err));

		this.isLoading$
			.asObservable()
			.pipe(
				takeUntil(this.destroy$),
				tap(state => {
					if (state) {
						this.spinnerService.showSpinner(state);
					} else {
						this.spinnerService.hideSpinner();
					}
				})
			)
			.subscribe();
	}

	clearValue(control: AbstractControl) {
		control.patchValue('');
	}

	handlePublish() {
		this.notificationService.dismissAll();
		this.postForm.get('title').markAsTouched();
		this.postForm.get('description').markAsTouched();
		if (this.postForm.invalid) {
			return;
		}
		this.isLoading$.next('Posting...');
		this.authService.currentUser$
			.pipe(
				take(1),
				switchMap(user =>
					this.post.asObservable().pipe(
						take(1),
						switchMap(post => {
							const postId = post ? post.id : this.postManager.createId();
							const removeOldFilesQuery = [of(true)];
							console.log('Function: headerImg, : ', this.postForm.get('headerImg').touched);

							if (this.postForm.get('headerImg').touched && post && post.headerImg) {
								console.log('Function: headerImg, push(this.storage.removeFile(post.headerImg.path): ');
								removeOldFilesQuery.push(this.storage.removeFile(post.headerImg.path));
							}
							console.log('Function: , : ', this.postForm.get('thumbImg').touched);
							if (this.postForm.get('thumbImg').touched && post && post.thumbImg) {
								console.log('Function: thumbImg, push(this.storage.removeFile(post.thumbImg.path): ');
								removeOldFilesQuery.push(this.storage.removeFile(post.thumbImg.path));
							}
							return zip(...removeOldFilesQuery).pipe(
								switchMap(() => {
									console.log('Function: , postId: ', postId);
									return zip(
										...(Object.keys(this.filesPendingForUpload).length
											? Object.keys(this.filesPendingForUpload).map(key => {
													const uploadItem: UploadItem = this.filesPendingForUpload[key];
													uploadItem.path = PostDetailsComponent.getPath(postId, uploadItem.file);
													return this.uploadFile(this.filesPendingForUpload[key]);
													// tslint:disable-next-line:indent
											  })
											: [of(null)])
									);
								}),
								concatMap(uploadResults => {
									const editDate = Math.floor(Date.now() / 1000);
									const updateFields = this.postBuilder(uploadResults, editDate);
									let newPost: Post;
									if (post) {
										newPost = {...post, ...updateFields};
										if (post.headerImg && !this.postForm.get('headerImg').value) {
											delete newPost.headerImg;
										}
										if (post.thumbImg && !this.postForm.get('thumbImg').value) {
											delete newPost.thumbImg;
										}
									} else {
										newPost = {
											id: postId,
											createdOn: editDate,
											author_uid: user.uid,
											...updateFields
										};
									}
									return this.postManager.writePost(newPost).pipe(map(() => newPost));
								})
							);
						})
					)
				),
				finalize(() => this.isLoading$.next(null))
			)
			.subscribe(post => {
				this.router
					.navigate([`../${post.id}`], {
						relativeTo: this.route,
						state: {
							...post
						}
					})
					.catch(err => {
						console.error('Navigation: , error: ', err);
					});
			});
	}

	uploadFile(batch: UploadItem): Observable<UploadFileData> {
		const {path, file} = batch;
		return this.storage.uploadAutomatically(path, file).pipe(
			map(url => {
				return {url, path, source: batch.source};
			})
		);
	}

	private prePopulateForm(post: Post) {
		this.postForm.patchValue({
			title: post.title,
			description: post.description
		});
		if (post.timeline) {
			this.postForm.patchValue({timeline: post.timeline});
		}
		if (post.role) {
			this.postForm.patchValue({role: post.role});
		}
		if (post.mediumLink) {
			this.postForm.patchValue({mediumLink: post.mediumLink});
		}
		if (post.prototypeLink) {
			this.postForm.patchValue({prototypeLink: post.prototypeLink});
		}
		if (post.headerImg) {
			this.postForm.patchValue({headerImg: {url: post.headerImg.url}});
		}
		if (post.thumbImg) {
			this.postForm.patchValue({thumbImg: {url: post.thumbImg.url}});
		}
	}

	private postBuilder(uploadResults: UploadFileData[], editDate: number) {
		let headerSource: UploadFileData;
		let thumbSource: UploadFileData;
		if (uploadResults.length) {
			headerSource = uploadResults.find(item => item && item.source === 'headerImg');
			thumbSource = uploadResults.find(item => item && item.source === 'thumbImg');
		}
		const postFormValues = this.postForm.value;
		const updateFields = {
			title: postFormValues.title,
			description: postFormValues.description,
			modifiedOn: editDate,
			role: postFormValues.role,
			prototypeLink: postFormValues.prototypeLink,
			mediumLink: postFormValues.mediumLink,
			timeline: postFormValues.timeline
		} as Post;
		if (headerSource) {
			updateFields.headerImg = {
				path: headerSource.path,
				url: headerSource.url
			};
		}
		if (thumbSource) {
			updateFields.thumbImg = {
				path: thumbSource.path,
				url: thumbSource.url
			};
		}
		return updateFields;
	}
	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.modalService.dismissAll();
	}

	showMedia() {
		const modalRef = this.modalService.open(MediaLibraryModalComponent, null, {size: 'lg'});
		from(modalRef.result)
			.pipe(
				take(1),
				catchError(err => (err ? throwError(err) : of(err)))
			)
			.subscribe();
	}
}
