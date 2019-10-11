import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {AuthService} from '../../../services/auth.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../../shared/services/notification.service';
import {CustomValidators} from '../../../../shared/utils/custom-validators';
import {catchError, switchMap, take, takeUntil} from 'rxjs/operators';
import {FormUtils} from '../../../../shared/utils/form-utils';
import {of, zip} from 'rxjs';
import {addInputmaskForPhone} from '../../../../shared/models/helper';
import {UserDataManagerService} from '../../../../shared/services/user-data-manager.service';
import * as isEqual from 'lodash.isequal';

@Component({
	selector: 'app-user-data',
	templateUrl: './user-data.component.html',
	styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent extends BaseObserverComponent implements OnInit {
	userForm: FormGroup;
	@ViewChild('mobileEl', {static: true}) mobileEl: ElementRef;

	constructor(
		private authService: AuthService,
		private fb: FormBuilder,
		private notificationService: NotificationService,
		private userDataManager: UserDataManagerService
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
				displayName: user.displayName,
				phone: user.contacts.phone,
				skype: user.contacts.skype,
				linkedIn: user.social && user.social.linkedIn ? user.social.linkedIn : '',
				medium: user.social && user.social.medium ? user.social.medium : '',
				github: user.social && user.social.github ? user.social.github : ''
			});
		});
	}

	private initForm() {
		this.userForm = this.fb.group({
			displayName: ['', [Validators.required, CustomValidators.validateName]],
			phone: ['', [CustomValidators.validateMobile]],
			skype: ['', []],
			linkedIn: ['', []],
			medium: ['', []],
			github: ['', []]
		});
		addInputmaskForPhone(this.mobileEl.nativeElement);
	}

	handleSave(event: MouseEvent) {
		event.preventDefault();
		console.log('Function: handleSave, this.userForm: ', this.userForm);
		this.notificationService.dismissAll();
		FormUtils.markFormFieldsAsDirty(this.userForm);
		if (this.userForm.invalid) {
			return;
		}
		const userData$ = this.authService.currentUser$.pipe(
			take(1),
			switchMap(storedUser => {
				const tempContacts = {...storedUser.contacts};
				const tempSocial = {...storedUser.social};
				tempContacts.skype = this.userForm.get('skype').value ? this.userForm.get('skype').value.trim() : '';
				tempContacts.phone = this.userForm.get('phone').value ? this.userForm.get('phone').value.trim() : '';
				tempSocial.medium = this.userForm.get('medium').value ? this.userForm.get('medium').value.trim() : '';
				tempSocial.linkedIn = this.userForm.get('linkedIn').value ? this.userForm.get('linkedIn').value.trim() : '';
				tempSocial.github = this.userForm.get('github').value ? this.userForm.get('github').value.trim() : '';
				const tempUser = {...storedUser, ...{contacts: tempContacts, social: tempSocial}};
				return isEqual(storedUser, tempUser) ? of(null) : this.userDataManager.updateUserData(tempUser);
			})
		);

		const newName = this.userForm.get('displayName').value;
		const displayName$ = newName
			? this.authService.currentUser$.pipe(
					take(1),
					switchMap(user => {
						if (user.displayName !== newName.trim()) {
							return this.authService.setNewDisplayName(newName.trim());
						} else {
							return of(null);
						}
					}),
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
		zip(displayName$, userData$).subscribe(result => {
			console.log('Function: , result: ', result);
			if (result.filter(res => res !== null).length) {
				this.notificationService.showSuccess({message: 'Your profile updated!', duration: 3000});
			}
		});
	}

	clearValue(control: AbstractControl) {
		control.patchValue('');
	}
}
