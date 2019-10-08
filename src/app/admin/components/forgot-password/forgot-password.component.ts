import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../../shared/utils/custom-validators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormUtils} from '../../../shared/utils/form-utils';
import {AuthService} from '../../../shared/services/auth.service';
import {NotificationService} from '../../../shared/services/notification.service';
import {fromEvent} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {BaseObserverComponent} from '../../../shared/components/base-observer/base-observer.component';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends BaseObserverComponent implements OnInit, AfterViewInit {
	emailForm: FormGroup;
	constructor(
		private fb: FormBuilder,
		public activeModal: NgbActiveModal,
		private authService: AuthService,
		private notificationService: NotificationService
	) {
		super();
	}

	ngOnInit() {
		this.emailForm = this.fb.group({
			email: ['', [Validators.required, CustomValidators.validateEmail]]
		});

		fromEvent(document, 'keydown')
			.pipe(
				filter((keyboardEvent: KeyboardEvent) => keyboardEvent.code === 'Enter'),
				takeUntil(this.destroy$)
			)
			.subscribe(keyboardEvent => this.handleReset(keyboardEvent));
	}

	goBack(event: MouseEvent) {
		event.preventDefault();
		this.activeModal.dismiss();
	}

	handleReset(event: any) {
		event.preventDefault();
		FormUtils.markFormFieldsAsDirty(this.emailForm);
		if (!this.emailForm.valid) {
			return;
		}

		this.authService
			.resetPasswordInit(this.emailForm.get('email').value)
			.then(
				() => {
					this.activeModal.close(true);
					this.notificationService.showSuccess({
						message: 'A password reset link has been sent to your email address',
						duration: 3000
					});
				},
				rejected =>
					this.notificationService.showError({
						message: rejected,
						enableClose: true
					})
			)
			.catch(error => {
				console.error('resetPasswordInit: , error: ', error);
				this.notificationService.showError({
					message: 'Something went wrong. Try again later, please.',
					enableClose: true
				});
			});
	}

	ngAfterViewInit(): void {}
}
