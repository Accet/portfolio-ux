import {Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MODAL_DATA, ModalService} from '../../../../shared/services/modal.service';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MatButton} from '@angular/material';
import {User} from '../../../../shared/models/user';
import {FormBuilder, FormControl} from '@angular/forms';
import {from, Observable, of, throwError} from 'rxjs';
import {DeleteConfirmationModalComponent} from '../../delete-confirmation-modal/delete-confirmation-modal.component';
import {catchError, concatMap, switchMap, take, tap} from 'rxjs/operators';
import {NotificationService} from '../../../../shared/services/notification.service';
import {FireStorageService} from '../../../services/fire-storage.service';
import {UserDataManagerService} from '../../../../shared/services/user-data-manager.service';

@Component({
	selector: 'app-media-library-modal',
	templateUrl: './media-library-modal.component.html',
	styleUrls: ['./media-library-modal.component.scss']
})
export class MediaLibraryModalComponent extends BaseObserverComponent implements OnInit {
	currentUser: User;
	selectedImage: FormControl;
	isSelected$: Observable<any>;

	constructor(
		@Optional() @Inject(MODAL_DATA) private modalData: any,
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private modalService: ModalService,
		private notificationService: NotificationService,
		private fireStorage: FireStorageService,
		private userService: UserDataManagerService
	) {
		super();
	}

	ngOnInit() {
		this.selectedImage = this.fb.control('', []);
		this.isSelected$ = this.selectedImage.valueChanges;
	}

	closeModal(event: MouseEvent) {
		if (event) {
			event.preventDefault();
		}
		this.activeModal.dismiss(null);
	}

	handleSelect() {
		this.activeModal.close(this.selectedImage.value);
	}

	handleDelete() {
		const ref = this.modalService.open(DeleteConfirmationModalComponent, {itemName: this.selectedImage.value.fileName});
		from(ref.result)
			.pipe(
				take(1),
				concatMap(() => this.fireStorage.removeFile(this.selectedImage.value.imagePath)),
				concatMap(() => this.fireStorage.removeFile(this.selectedImage.value.thumbPath)),
				concatMap(() =>
					this.userService.userInfo$.pipe(
						take(1),
						switchMap(user => {
							console.log('Function: , user: ', user);
							const updatedUser = {
								...user,
								uploads: user.uploads.filter(item => item.fileName !== this.selectedImage.value.fileName)
							};
							console.log('Function: , updatedUser: ', updatedUser);
							return this.userService.updateUserData(updatedUser, true);
						})
					)
				),
				tap(() => {
					this.notificationService.showSuccess({message: 'File removed from cloud', duration: 3000});
					this.selectedImage.setValue(null);
				}),
				catchError(err => {
					if (!err) {
						return of(err);
					} else {
						this.notificationService.showError({
							message: err.message ? err.message : 'Something went wrong, try again later.',
							enableClose: true,
							duration: 5000
						});
						return throwError(err);
					}
				})
			)
			.subscribe(
				() => {},
				error => {
					console.error('Function: handleDelete, error: ', error);
				}
			);
	}
}
