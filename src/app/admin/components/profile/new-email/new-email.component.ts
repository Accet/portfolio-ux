import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {NotificationService} from '../../../../shared/services/notification.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {CustomValidators} from '../../../../shared/utils/custom-validators';
import {catchError, concatMap, debounceTime, shareReplay, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {LoginModalComponent} from '../../login-modal/login-modal.component';
import {BehaviorSubject, combineLatest, from, Observable, of} from 'rxjs';
import {User} from '../../../../shared/models/user';

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
				takeUntil(this.destroy$),
				debounceTime(300),
				switchMap(email => combineLatest([of(email), this.authService.currentUser$])),
				tap(([email, user]) => this.isDisabled.next(!email || email === user.email))
			)
			.subscribe();
	}

	onUpdateEmail(event: MouseEvent) {
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
				switchMap(() => this.authService.setNewEmail(this.emailControl.value)),
				switchMap(() => {
					const reloginRef = this.modalService.open(
						LoginModalComponent,
						{email: this.emailControl.value},
						{size: 'sm'}
					);
					return from(reloginRef.result).pipe(
						catchError(() => {
							this.notificationService.dismissAll();
							return of(null);
						})
					);
				})
			)
			.subscribe(() => {}, () => {});
	}
}
