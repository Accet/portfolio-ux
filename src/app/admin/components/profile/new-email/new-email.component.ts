import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {NotificationService} from '../../../../shared/services/notification.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {CustomValidators} from '../../../../shared/utils/custom-validators';
import {debounceTime, filter, shareReplay, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {LoginModalComponent} from '../../login-modal/login-modal.component';
import {BehaviorSubject, combineLatest, from, of} from 'rxjs';

@Component({
	selector: 'app-new-email',
	templateUrl: './new-email.component.html',
	styleUrls: ['./new-email.component.scss']
})
export class NewEmailComponent extends BaseObserverComponent implements OnInit {
	emailControl: FormControl;

	isDisabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

	constructor(
		private authService: AuthService,
		private fb: FormBuilder,
		private notificationService: NotificationService,
		private modalService: ModalService
	) {
		super();
	}

	ngOnInit() {
		this.emailControl = this.fb.control('', [Validators.required, CustomValidators.validateEmail]);
		this.authService.currentUser$
			.pipe(
				takeUntil(this.destroy$),
				shareReplay(1)
			)
			.subscribe(user => {
				if (!user) {
					return;
				}
				this.emailControl.patchValue(user.email);
			});

		this.emailControl.valueChanges
			.pipe(
				debounceTime(300),
				switchMap(email => combineLatest([of(email), this.authService.currentUser$.pipe(filter(val => !!val))])),
				tap(([email, user]) => this.isDisabled.next(!email || email === user.email)),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	onUpdateEmail(event: MouseEvent) {
		event.preventDefault();
		this.emailControl.markAsTouched();
		this.emailControl.updateValueAndValidity();
		if (this.emailControl.invalid) {
			return;
		}

		this.authService.currentUser$
			.pipe(
				take(1),
				switchMap(user => {
					const modalRef = this.modalService.open(LoginModalComponent, {email: user.email}, {size: 'sm'});
					return from(modalRef.result);
				}),
				switchMap(() => this.authService.setNewEmail(this.emailControl.value))
			)
			.subscribe(() => {}, () => {});
	}
}
