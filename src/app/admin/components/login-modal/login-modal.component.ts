import {Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {catchError, filter, mergeMap, takeUntil, tap} from 'rxjs/operators';
import {from, fromEvent, throwError} from 'rxjs';
import {FormUtils} from '../../../shared/utils/form-utils';
import {CustomValidators} from '../../../shared/utils/custom-validators';
import {MatButton} from '@angular/material';
import {BaseObserverComponent} from '../../../shared/components/base-observer/base-observer.component';
import {MODAL_DATA, ModalService} from '../../../shared/services/modal.service';
import {ForgotPasswordModalComponent} from '../forgot-password/forgot-password-modal.component';
import {NotificationService} from '../../../shared/services/notification.service';
import {AuthService} from '../../services/auth.service';

@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent extends BaseObserverComponent implements OnInit {
	private capsLockState: boolean;
	private passwordFocus: boolean;
	visiblePassword = false;
	stopListeningForSubmit = false;
	private readonly email: string;

	@ViewChild('btnRef', {static: true}) buttonRef: MatButton;
	@ViewChild('popOver', {static: false}) popOver: NgbPopover;

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private modalService: ModalService,
		private notificationService: NotificationService,
		@Optional() @Inject(MODAL_DATA) private modalData: any
	) {
		super();
		if (this.modalData && this.modalData.data) {
			this.email = this.modalData.data.email;
		}
	}

	loginForm: FormGroup;

	ngOnInit() {
		this.initForm();
		this.buttonRef.focus();
		fromEvent(document, 'keydown')
			.pipe(
				filter((keyboardEvent: KeyboardEvent) => keyboardEvent.code === 'Enter'),
				takeUntil(this.destroy$)
			)
			.subscribe(keyboardEvent => {
				if (!this.stopListeningForSubmit) {
					this.handleLogin(keyboardEvent);
				}
			});
	}

	closeModal(event?: MouseEvent) {
		if (event) {
			event.preventDefault();
		}
		this.activeModal.dismiss(null);
	}

	handleLogin(event: any) {
		event.preventDefault();
		FormUtils.markFormFieldsAsDirty(this.loginForm);
		if (!this.loginForm.valid) {
			return;
		}
		const password = this.loginForm.value.password;
		const email = this.email ? this.email : this.loginForm.value.email;
		this.authService
			.login(email, password)
			.pipe(
				catchError(error => {
					switch (error.code) {
						case 'auth/invalid-email': {
							this.loginForm.get('email').setErrors({validateEmail: true});
							break;
						}
						case 'auth/user-disabled': {
							this.loginForm.get('email').setErrors({disabled: true});
							break;
						}
						case 'auth/user-not-found': {
							this.loginForm.get('email').setErrors({notFound: true});
							break;
						}
						case 'auth/wrong-password': {
							this.loginForm.get('password').setErrors({invalid: true});
							break;
						}
						default:
							break;
					}
					return throwError(error);
				})
			)
			.subscribe(() => this.activeModal.close(), error => console.log('Function: login, error: ', error));
	}

	private initForm() {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, CustomValidators.validateEmail]],
			password: ['', [Validators.required]]
		});

		if (this.email) {
			this.loginForm.get('email').disable();
			this.loginForm.updateValueAndValidity();
		}
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

	handleFocusOnPassword(value: boolean): void {
		this.passwordFocus = value;
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

	showForgot(event: MouseEvent) {
		event.preventDefault();
		this.stopListeningForSubmit = true;
		const modalRef = this.modalService.open(ForgotPasswordModalComponent, null, {size: 'sm'});
		modalRef.result
			.then(() => {})
			.catch(() => {
				this.notificationService.dismissAll();
			})
			.finally(() => (this.stopListeningForSubmit = false));
	}
}
