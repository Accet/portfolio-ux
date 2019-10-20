import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {BehaviorSubject, from, merge, Observable, of, Subject, throwError} from 'rxjs';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {FormBuilder, FormControl} from '@angular/forms';
import {BaseObserverComponent} from '../../../shared/components/base-observer/base-observer.component';
import {
	catchError,
	concatMap,
	debounceTime,
	distinctUntilChanged,
	filter,
	finalize,
	map,
	shareReplay,
	switchMap,
	take,
	takeUntil,
	tap
} from 'rxjs/operators';
import {DropZoneDirective} from '../../directives/drop-zone.directive';
import {FileInput} from 'ngx-material-file-input';
import {NotificationService} from '../../../shared/services/notification.service';
import {UserDataManagerService} from '../../../shared/services/user-data-manager.service';
import {UploadTaskSnapshot} from '@angular/fire/storage/interfaces';
import {AuthService} from '../../services/auth.service';
import {User} from '../../../shared/models/user';
import {transition, trigger, useAnimation} from '@angular/animations';
import {verticalIn, verticalOut} from '../../../shared/animations/animations';

export enum UploadType {
	RESUME,
	AVATAR,
	OTHER
}

export interface UploadFileData {
	url: string;
	path: string;
}

@Component({
	selector: 'app-file-upload',
	animations: [
		trigger('enterAnimation', [
			transition(':enter', [
				useAnimation(verticalIn, {
					params: {
						time: '500ms'
					}
				})
			]),
			transition(':leave', [
				useAnimation(verticalOut, {
					params: {
						time: '500ms'
					}
				})
			])
		])
	],
	templateUrl: './user-file-upload.component.html',
	styleUrls: ['./user-file-upload.component.scss']
})
export class UserFileUploadComponent extends BaseObserverComponent implements OnInit, OnChanges {
	percentage: Observable<number>;
	snapshot: Observable<UploadTaskSnapshot>;
	task: AngularFireUploadTask;
	dropFile$: Subject<DropZoneDirective> = new Subject<DropZoneDirective>();
	fileControl: FormControl;
	placeholder: string;
	currentUser: User;
	labelMessage: string;
	public lottieConfig: any;
	private anim: any;

	isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private _isHovering$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	isHovering$: Observable<boolean>;
	isUploaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	@ViewChild(DropZoneDirective, {static: false}) set dropFile(element: DropZoneDirective) {
		this.dropFile$.next(element);
	}

	uploadType = UploadType;
	@Input() mode: UploadType;
	@Output() downloadUrl: EventEmitter<UploadFileData> = new EventEmitter();

	constructor(
		private fb: FormBuilder,
		private notificationService: NotificationService,
		private userManager: UserDataManagerService,
		private authService: AuthService,
		private storage: AngularFireStorage
	) {
		super();
		this.lottieConfig = {
			path: 'assets/upload.json',
			autoplay: true,
			loop: true
		};
	}

	ngOnInit() {
		this.fileControl = this.fb.control(null, []);
		this.authService.currentUser$
			.pipe(
				takeUntil(this.destroy$),
				tap(user => {
					this.currentUser = user;
					switch (this.mode) {
						case UploadType.RESUME:
							this.placeholder =
								user && user.resume && user.resume.path ? this.storage.storage.ref(user.resume.path).name : undefined;
							break;
						case UploadType.AVATAR:
							this.placeholder =
								user && user.photoURL && user.photoURL.path
									? this.storage.storage.ref(user.photoURL.path).name
									: undefined;
							break;
						default:
							break;
					}
				})
			)
			.subscribe();
		let path: string;
		const dropped$ = this.dropFile$.asObservable().pipe(switchMap(el => el.dropped.asObservable()));

		merge(
			this.fileControl.valueChanges.pipe(
				map(value => {
					this.isUploaded$.next(false);
					return value && value._files ? value._files[0] : null;
				})
			),
			dropped$.pipe(map(event => event.item(0)))
		)
			.pipe(
				filter(value => !!value),
				switchMap(file => {
					const newInput: FileInput = new FileInput([file], ',');
					this.fileControl.setValue(newInput, {emitEvent: false});

					Object.defineProperty(file, 'name', {
						writable: true,
						value: file.name.replace(/ /g, '_').toLocaleLowerCase()
					});
					path = this.getPath(file);
					if (!path) {
						return of(null);
					}
					this.isLoading$.next(true);
					return this.removeOldFiles().pipe(
						concatMap(() =>
							this.uploadFile(file, path).pipe(
								concatMap(url =>
									url ? this.updateUserData(url, path).pipe(tap(() => this.isUploaded$.next(true))) : of(null)
								)
							)
						),
						catchError(error => {
							console.log('Function: , error: ', error);
							this.notificationService.showError({
								message: 'Oops. We experienced a problem uploading this file. Try again, please.',
								duration: 5000,
								enableClose: true
							});
							this.isUploaded$.next(false);
							this.isLoading$.next(false);
							return throwError(error);
						})
					);
				}),
				tap(() => this.isLoading$.next(false)),
				takeUntil(this.destroy$)
			)
			.subscribe(
				res => {
					if (res) {
						this.notificationService.showSuccess({message: 'File uploaded!', duration: 3000});
					}
				},
				() => {
					console.log('Function: error, : ');
				}
			);

		this.isHovering$ = this._isHovering$.asObservable().pipe(
			distinctUntilChanged(),
			debounceTime(50)
		);
	}

	uploadFile(file: File, path: string): Observable<any> {
		const fileRef = this.storage.ref(path);
		this.task = this.storage.upload(path, file);
		this.percentage = this.task.percentageChanges();
		this.snapshot = this.task.snapshotChanges().pipe(shareReplay(1));
		return from(
			this.snapshot
				.toPromise()
				.then(() => fileRef.getDownloadURL().toPromise())
				.catch(() => Promise.resolve(null))
		).pipe(
			finalize(() => {
				this.task = null;
				this.percentage = of();
			})
		);
	}

	toggleHover(event) {
		this.isUploaded$.next(false);
		this._isHovering$.next(event);
	}

	isActive(snapshot) {
		return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
	}

	onCancel(event: MouseEvent) {
		event.preventDefault();
		if (this.task) {
			this.task.cancel();
			this.isLoading$.next(false);
			this.fileControl.setValue(null, {emitEvent: false});
			this.isUploaded$.next(false);
			this.authService.currentUser$
				.pipe(
					take(1),
					switchMap(user => {
						switch (this.mode) {
							case UploadType.RESUME:
								delete user.resume;
								return this.userManager.updateUserData(user, true);
							case UploadType.AVATAR:
								delete user.photoURL;
								return this.userManager
									.updateUserData(user, true)
									.pipe(concatMap(() => this.authService.setNewProfilePicture()));
							default:
								return of(null);
						}
					})
				)
				.subscribe(
					() => {
						this.notificationService.showWarning({message: 'Uploading cancelled', duration: 3000});
					},
					err => {
						this.notificationService.showError({
							message: err.message || 'Error occurred while updating the user',
							duration: 3000
						});
						console.error('Function: onCancel, updateUserData err: ', err);
					}
				);
		}
	}

	private getPath(file: File): string {
		switch (this.mode) {
			case UploadType.RESUME:
				if (
					!(
						file.type.split('/')[1] === 'pdf' ||
						file.type.split('/')[1] === 'msword' ||
						file.type.split('/')[1].includes('document')
					)
				) {
					this.notificationService.showError({
						message: 'Unsupported file type. Select PDF or Word document file',
						duration: 5000,
						enableClose: true
					});
					console.error('unsupported file type :( ');
					this.fileControl.reset();
					return;
				} else {
					return `cv/${new Date().getTime()}_${file.name}`;
				}
			case UploadType.AVATAR:
				return `user/${new Date().getTime()}_${file.name}`;
			// tslint:disable-next-line:no-switch-case-fall-through
			case UploadType.OTHER:
				if (file.type.split('/')[0] !== 'image') {
					console.error('unsupported file type :( ');
					this.notificationService.showError({
						message: 'Unsupported file type. Select only image files',
						duration: 5000,
						enableClose: true
					});
					this.fileControl.reset();
					return;
				} else {
					return `web/${new Date().getTime()}_${file.name}`;
				}
		}
	}

	private removeOldFiles(): Observable<any> {
		if (this.mode === UploadType.RESUME && this.currentUser.resume) {
			return this.storage
				.ref(this.currentUser.resume.path)
				.delete()
				.pipe(catchError(err => (err.code_ === 'storage/object-not-found' ? of(true) : throwError(err))));
		}
		if (this.mode === UploadType.AVATAR && this.currentUser.photoURL) {
			return this.storage
				.ref(this.currentUser.photoURL.path)
				.delete()
				.pipe(catchError(err => (err.code_ === 'storage/object-not-found' ? of(true) : throwError(err))));
		}
		return of(true);
	}

	private updateUserData(url: string, path: string): Observable<UploadFileData> {
		const data: UploadFileData = {
			url,
			path
		};
		switch (this.mode) {
			case UploadType.RESUME:
				return this.userManager.updateUserData({...this.currentUser, ...{resume: data}}).pipe(map(() => data));
			case UploadType.AVATAR:
				return this.userManager
					.updateUserData({...this.currentUser, ...{photoURL: data}})
					.pipe(map(() => data))
					.pipe(concatMap(() => this.authService.setNewProfilePicture(data.url)));
			default:
				return of(data);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes && changes.mode) {
			switch (changes.mode.currentValue) {
				case UploadType.RESUME:
					this.labelMessage = 'Upload your resume';
					break;
				case UploadType.AVATAR:
					this.labelMessage = 'Upload your photo';
					break;
				case UploadType.OTHER:
					this.labelMessage = 'Upload your image';
					break;
			}
		}
	}

	handleAnimation(anim) {
		this.anim = anim;
	}
}
