import {Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {fromEvent} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {BaseObserverComponent} from '../../../shared/components/base-observer/base-observer.component';
import {CustomValidators} from '../../../shared/utils/custom-validators';
import {FormUtils, MyErrorStateMatcher} from '../../../shared/utils/form-utils';
import {MatButton} from '@angular/material';
import {MODAL_DATA} from '../../../shared/services/modal.service';
import {NotificationService} from '../../../shared/services/notification.service';
import {AuthService} from '../../services/auth.service';

@Component({
	selector: 'app-reset-password-modal',
	templateUrl: './reset-password-modal.component.html',
	styleUrls: ['./reset-password-modal.component.scss']
})
export class ResetPasswordModalComponent extends BaseObserverComponent implements OnInit {
	resetForm: FormGroup;
	private capsLockState: boolean;
	private passwordFocus: boolean;
	visiblePassword = false;
	matcher = new MyErrorStateMatcher();
	private readonly code: string;

	@ViewChild('popOver', {static: false}) popOver: NgbPopover;
	@ViewChild('btnRef', {static: true}) buttonRef: MatButton;

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private notificationService: NotificationService,
		@Optional() @Inject(MODAL_DATA) private modalData: any
	) {
		super();
		if (this.modalData && this.modalData.data) {
			this.code = this.modalData.data.code;
		}
	}

	ngOnInit() {
		this.initForm();
		this.buttonRef.focus();

		fromEvent(document, 'keydown')
			.pipe(
				filter((keyboardEvent: KeyboardEvent) => keyboardEvent.code === 'Enter'),
				takeUntil(this.destroy$)
			)
			.subscribe(keyboardEvent => {
				this.handleReset(keyboardEvent);
			});
	}

	closeModal(event?: MouseEvent) {
		if (event) {
			event.preventDefault();
		}
		this.activeModal.dismiss(null);
	}

	handleReset(event: any) {
		event.preventDefault();
		this.notificationService.dismissAll();
		FormUtils.markFormFieldsAsDirty(this.resetForm);
		if (!this.resetForm.valid || !this.code) {
			return;
		}
		const newPassword = this.resetForm.get('password').value;
		this.authService
			.confirmPasswordReset(this.code, newPassword)
			.then(() => {
				this.activeModal.close(true);
				this.notificationService.showSuccess({
					message: 'New password has been saved',
					duration: 3000
				});
			})
			.catch(error => {
				console.error('Function: confirmPasswordReset, error: ', error);
				this.notificationService.showError({
					message: 'Error occurred during confirmation. The code might have expired or the password is too weak',
					enableClose: true
				});
			});
	}

	private initForm() {
		this.resetForm = this.fb.group(
			{
				password: ['', [Validators.required, Validators.minLength(8)]],
				passwordConfirm: ['', []]
			},
			{validators: CustomValidators.checkPasswords}
		);
	}

	handleFocusOnPassword(state: boolean) {
		this.passwordFocus = state;
		if (this.capsLockState && this.passwordFocus && !this.popOver.isOpen()) {
			this.showCapsLockWarning();
		} else if (!this.passwordFocus && this.popOver.isOpen()) {
			this.popOver.close();
		}
	}

	showCapsLockWarning(): void {
		this.popOver.open();
	}

	togglePasswordVisibility(event: MouseEvent) {
		event.preventDefault();
		this.visiblePassword = !this.visiblePassword;
	}

	handleCapsLockState(isOn: boolean) {
		if (this.capsLockState !== isOn) {
			this.capsLockState = isOn;
			if (this.capsLockState && this.passwordFocus) {
				this.showCapsLockWarning();
			} else if (this.popOver.isOpen()) {
				this.popOver.close();
			}
		}
	}
}
