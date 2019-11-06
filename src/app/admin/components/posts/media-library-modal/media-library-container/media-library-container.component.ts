import {Component, Input, OnInit} from '@angular/core';
import {UserDataManagerService} from '../../../../../shared/services/user-data-manager.service';
import {BaseObserverComponent} from '../../../../../shared/components/base-observer/base-observer.component';
import {BehaviorSubject, Observable, of, zip} from 'rxjs';
import {
	concatMap,
	debounceTime,
	distinctUntilChanged,
	filter,
	map,
	switchMap,
	take,
	takeUntil,
	tap
} from 'rxjs/operators';
import {FormBuilder, FormControl} from '@angular/forms';
import {FireStorageService} from '../../../../services/fire-storage.service';
import {CompressorService} from '../../../../services/compressor.service';
import {User, UserUploads} from '../../../../../shared/models/user';

@Component({
	selector: 'app-media-library-container',
	templateUrl: './media-library-container.component.html',
	styleUrls: ['./media-library-container.component.scss']
})
export class MediaLibraryContainerComponent extends BaseObserverComponent implements OnInit {
	uploads$: Observable<UserUploads[]>;
	currentUser$: Observable<User>;
	uploadControl: FormControl;
	private _isHovering$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	isHovering$: Observable<boolean>;

	// @Input() currentUser: User;

	constructor(
		private userService: UserDataManagerService,
		private fb: FormBuilder,
		private storageService: FireStorageService,
		private compressor: CompressorService
	) {
		super();
	}

	ngOnInit() {
		this.uploadControl = this.fb.control(null, []);
		this.currentUser$ = this.userService.userInfo$;
		this.uploads$ = this.currentUser$.pipe(map(user => user.uploads));

		// TODO: Error handling on upload
		this.uploadControl.valueChanges
			.pipe(
				takeUntil(this.destroy$),
				filter(value => !!value.file),
				map(fileRecord => {
					const {file} = fileRecord;
					console.log('Function: , file: ', file);
					Object.defineProperty(file, 'name', {
						writable: true,
						value: file.name.replace(/ /g, '_').toLocaleLowerCase()
					});
					return file;
				}),

				concatMap(originalFile =>
					this.compressor.compress(originalFile, null, 1 / 4).pipe(
						concatMap(thumbFile =>
							zip(
								this.storageService.uploadAutomatically(`uploads/${thumbFile.name}`, thumbFile),
								this.storageService.uploadAutomatically(`uploads/${originalFile.name}`, originalFile)
							)
						),
						concatMap(([thumbUrl, imageUrl]) => {
							return this.currentUser$.pipe(
								take(1),
								concatMap(user => {
									const newUploads: UserUploads[] = [
										{
											thumbUrl,
											imageUrl
										}
									];
									if (user.uploads) {
										newUploads.push(...user.uploads);
									}
									user.uploads = newUploads;
									return this.userService.updateUserData(user);
								})
							);
						})
					)
				)
			)
			.subscribe(() => {});

		this.isHovering$ = this._isHovering$.asObservable().pipe(distinctUntilChanged());
		this.isHovering$.subscribe(val => {
			console.log('Function: , val: ', val);
		});
	}

	handleHovered(event: boolean) {
		this._isHovering$.next(event);
	}

	handleSelect(event: MouseEvent) {}
}
