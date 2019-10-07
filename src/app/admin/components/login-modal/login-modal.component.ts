import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {catchError, filter, mergeMap, takeUntil, tap} from 'rxjs/operators';
import {from, fromEvent, throwError} from 'rxjs';
import {AuthService} from '../../../shared/services/auth.service';
import {FormUtils} from '../../../shared/utils/form-utils';
import {CustomValidators} from '../../../shared/utils/custom-validators';
import {MatButton} from '@angular/material';
import {BaseObserverComponent} from '../../../shared/components/base-observer/base-observer.component';

@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent extends BaseObserverComponent implements OnInit {
	private capsLockState: boolean;
	private passwordFocus: boolean;
	visiblePassword = false;
	@ViewChild('btnRef', {static: true}) buttonRef: MatButton;
	@ViewChild('popOver', {static: false}) popOver: NgbPopover;

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private router: Router,
		private authService: AuthService
	) {
		super();
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
				this.handleLogin(keyboardEvent);
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
		const {email, password} = this.loginForm.value;
		this.authService
			.login(email, password)
			.pipe(
				catchError(error => {
					console.log('Function: , error: ', error);
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
				}),
				mergeMap(() => from(this.router.navigate(['/admin']))),
				tap(() => this.activeModal.close())
			)
			.subscribe(() => {}, error => console.log('Function: login, error: ', error));
	}

	private initForm() {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, CustomValidators.validateEmail]],
			password: ['', [Validators.required]]
		});
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
}
