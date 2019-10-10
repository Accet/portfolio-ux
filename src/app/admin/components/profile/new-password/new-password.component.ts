import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, from, throwError} from 'rxjs';
import {FormUtils, MyErrorStateMatcher} from '../../../../shared/utils/form-utils';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../../shared/services/notification.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {CustomValidators} from '../../../../shared/utils/custom-validators';
import {catchError, debounceTime, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {LoginModalComponent} from '../../login-modal/login-modal.component';

@Component({
	selector: 'app-new-password',
	templateUrl: './new-password.component.html',
	styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent extends BaseObserverComponent implements OnInit {
	private capsLockState: boolean;
	private passwordFocus: boolean;
	visiblePassword = false;
	matcher = new MyErrorStateMatcher();
	isDisabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

	passwordForm: FormGroup;

	@ViewChild('popOver', {static: false}) popOver: NgbPopover;

	constructor(
		private authService: AuthService,
		private fb: FormBuilder,
		private notificationService: NotificationService,
		private modalService: ModalService
	) {
		super();
	}

	ngOnInit() {
		this.initForm();

		this.passwordForm.valueChanges
			.pipe(
				takeUntil(this.destroy$),
				debounceTime(300),
				tap(newVal => this.isDisabled.next(!newVal.password))
			)
			.subscribe();
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

	private initForm() {
		this.passwordForm = this.fb.group(
			{
				password: ['', [Validators.minLength(8)]],
				passwordConfirm: ['', []]
			},
			{validators: CustomValidators.checkPasswords}
		);
	}

	onUpdatePassword(event: MouseEvent) {
		event.preventDefault();
		console.log('Function: onUpdatePassword, this.passwordForm: ', this.passwordForm);
		this.notificationService.dismissAll();
		FormUtils.markFormFieldsAsDirty(this.passwordForm);
		if (this.passwordForm.invalid) {
			return;
		}
		this.authService.currentUser$
			.pipe(
				take(1),
				switchMap(user => {
					const modalRef = this.modalService.open(LoginModalComponent, {email: user.email}, {size: 'sm'});
					return from(modalRef.result);
				}),

				switchMap(() =>
					this.authService.setNewPassword(this.passwordForm.get('password').value.trim()).pipe(
						take(1),
						catchError(err => {
							console.error('Function: setNewPassword, error: ', err);
							this.notificationService.showError({
								message: err['message'] ? err['message'] : 'Something went wrong. Try again later, please.',
								enableClose: true,
								duration: 5000
							});
							return throwError(err);
						})
					)
				)
			)
			.subscribe(
				() => this.notificationService.showSuccess({message: 'Your password changed!', duration: 3000}),
				() => {}
			);
	}
}
