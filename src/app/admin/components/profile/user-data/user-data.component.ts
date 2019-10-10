import {Component, OnInit} from '@angular/core';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {AuthService} from '../../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../../shared/services/notification.service';
import {CustomValidators} from '../../../../shared/utils/custom-validators';
import {catchError, take, takeUntil} from 'rxjs/operators';
import {FormUtils} from '../../../../shared/utils/form-utils';
import {of, zip} from 'rxjs';

@Component({
	selector: 'app-user-data',
	templateUrl: './user-data.component.html',
	styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent extends BaseObserverComponent implements OnInit {
	userForm: FormGroup;

	constructor(
		private authService: AuthService,
		private fb: FormBuilder,
		private notificationService: NotificationService
	) {
		super();
	}

	ngOnInit() {
		this.initForm();
		this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
			console.log('Function: CHANGED, user: ', user);
			if (!user) {
				return;
			}
			this.userForm.patchValue({
				displayName: user.displayName
			});
		});
	}

	private initForm() {
		this.userForm = this.fb.group({
			displayName: ['', [Validators.required, CustomValidators.validateName]],
			phone: ['', [CustomValidators.validateMobile]]
		});
	}

	handleSave(event: MouseEvent) {
		event.preventDefault();
		console.log('Function: onUpdatePassword, this.passwordForm: ', this.userForm);
		this.notificationService.dismissAll();
		FormUtils.markFormFieldsAsDirty(this.userForm);
		if (this.userForm.invalid) {
			return;
		}
		const newName = this.userForm.get('displayName').value;
		const displayName$ = newName
			? this.authService.setNewDisplayName(newName).pipe(
					take(1),
					catchError(err => {
						console.error('Function: setNewDisplayName, ERROR: ', err);
						this.notificationService.showError({
							message: err['message'] ? err['message'] : 'Something went wrong. Try again later, please.',
							enableClose: true,
							duration: 5000
						});
						return of(err);
					})
			  )
			: of(null);

		zip(displayName$).subscribe(() => {
			this.notificationService.showSuccess({message: 'Your profile updated!', duration: 3000});
		});
	}
}
