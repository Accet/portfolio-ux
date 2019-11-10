import {Component, OnInit} from '@angular/core';
import {UserDataManagerService} from '../../../../../shared/services/user-data-manager.service';
import {BaseObserverComponent} from '../../../../../shared/components/base-observer/base-observer.component';
import {BehaviorSubject, Observable, of, throwError, zip} from 'rxjs';
import {catchError, concatMap, distinctUntilChanged, filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ControlValueAccessor, FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FireStorageService} from '../../../../services/fire-storage.service';
import {CompressorService} from '../../../../services/compressor.service';
import {User, UserUploads} from '../../../../../shared/models/user';
import {NotificationService} from '../../../../../shared/services/notification.service';

@Component({
	selector: 'app-media-library-container',
	templateUrl: './media-library-container.component.html',
	styleUrls: ['./media-library-container.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: MediaLibraryContainerComponent,
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: MediaLibraryContainerComponent,
			multi: true
		}
	]
})
export class MediaLibraryContainerComponent extends BaseObserverComponent implements ControlValueAccessor, OnInit {
	uploads$: Observable<UserUploads[]>;
	uploadControl: FormControl;
	private _isHovering$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	isHovering$: Observable<boolean>;
	selectedItem$: BehaviorSubject<UserUploads> = new BehaviorSubject<UserUploads>(null);
	private user: User;

	ghostItems = new Array(5);

	constructor(
		private userService: UserDataManagerService,
		private fb: FormBuilder,
		private storageService: FireStorageService,
		private compressor: CompressorService,
		private notificationService: NotificationService
	) {
		super();
	}

	ngOnInit() {
		this.uploadControl = this.fb.control(null, []);
		this.uploads$ = this.userService.userInfo$.pipe(
			tap(user => {
				this.user = user;
				this.uploadControl.setValue(null);
			}),
			map(user => (user.uploads ? user.uploads : []))
		);

		this.uploadControl.valueChanges
			.pipe(
				takeUntil(this.destroy$),
				filter(value => !!value && !!value.file),
				map(fileRecord => {
					const {file} = fileRecord;
					Object.defineProperty(file, 'name', {
						writable: true,
						value: file.name.replace(/ /g, '_').toLocaleLowerCase()
					});
					return file;
				}),
				switchMap(originalFile =>
					this.compressor
						.compress(
							new File([originalFile], originalFile.name, {
								type: originalFile.type,
								lastModified: Date.now()
							}),
							300,
							true
						)
						.pipe(
							concatMap(thumbFile =>
								zip(
									this.storageService.uploadAutomatically(`uploads/${thumbFile.name}`, thumbFile),
									this.storageService.uploadAutomatically(`uploads/${originalFile.name}`, originalFile)
								).pipe(
									concatMap(([thumbUrl, imageUrl]) => {
										const newUploads: UserUploads[] = [
											{
												thumbUrl,
												imageUrl,
												imagePath: `uploads/${originalFile.name}`,
												thumbPath: `uploads/${thumbFile.name}`,
												fileName: originalFile.name
											}
										];
										if (this.user.uploads) {
											newUploads.push(...this.user.uploads);
										}
										this.user.uploads = newUploads;
										return this.userService.updateUserData(this.user);
									})
								)
							)
						)
				),
				catchError(err => {
					this.notificationService.showError({
						message: err.message ? err.message : 'Something went wrong, try again later.',
						enableClose: true,
						duration: 5000
					});
					return throwError(err);
				})
			)
			.subscribe(() => {});

		this.isHovering$ = this._isHovering$.asObservable().pipe(distinctUntilChanged());
		this.selectedItem$
			.asObservable()
			.pipe(takeUntil(this.destroy$))
			.subscribe(item => this.propagateChange(item));
	}

	handleHovered(event: boolean) {
		this._isHovering$.next(event);
	}

	onSelect(upload: UserUploads) {
		this.selectedItem$.next(
			this.selectedItem$.value && this.selectedItem$.value.imageUrl === upload.imageUrl ? null : upload
		);
	}

	validate({value}: FormControl) {
		return null;
	}

	private propagateChange = (_: UserUploads) => {};

	writeValue(obj: UserUploads): void {
		if (obj !== undefined) {
			this.selectedItem$.next(obj);
		}
	}
	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {}
}
