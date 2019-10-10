import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseObserverComponent} from '../shared/components/base-observer/base-observer.component';
import {catchError, concatMap, finalize, switchMap, takeUntil} from 'rxjs/operators';
import {ModalService} from '../shared/services/modal.service';
import {from, of, ReplaySubject, throwError} from 'rxjs';
import {LoginModalComponent} from './components/login-modal/login-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../shared/services/notification.service';
import {ResetPasswordModalComponent} from './components/reset-password-modal/reset-password-modal.component';
import {AuthService} from './services/auth.service';

enum AuthActions {
	RESET_PASSWORD = 'resetPassword',
	RECOVER_EMAIL = 'recoverEmail',
	VERIFY_EMAIL = 'verifyEmail'
}

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends BaseObserverComponent implements OnInit, OnDestroy {
	checkUser$: ReplaySubject<any> = new ReplaySubject(1);

	constructor(
		private authService: AuthService,
		private modalService: ModalService,
		private router: Router,
		private route: ActivatedRoute,
		private notificationService: NotificationService
	) {
		super();
	}

	ngOnInit() {
		this.route.queryParams
			.pipe(
				takeUntil(this.destroy$),
				switchMap(params => {
					const {mode, oobCode} = params;
					switch (mode) {
						case AuthActions.RESET_PASSWORD:
							return this.authService.verifyPasswordResetCode(oobCode).pipe(
								catchError(() => {
									this.notificationService.showError({
										message: 'Invalid or expired access code. Try to reset password again.',
										enableClose: true
									});
									return from(this.router.navigate([this.route.snapshot.url], {relativeTo: this.route}));
								}),
								concatMap(() => {
									const modalRef = this.modalService.open(ResetPasswordModalComponent, {code: oobCode}, {size: 'sm'});
									return from(modalRef.result).pipe(
										catchError(() => {
											this.notificationService.dismissAll();
											return of(null);
										}),
										finalize(() => this.router.navigate([this.route.snapshot.url], {relativeTo: this.route}))
									);
								})
							);
						case AuthActions.RECOVER_EMAIL:
							return of(false);
						case AuthActions.VERIFY_EMAIL:
							return of(false);

						default:
							this.checkUser$.next(true);
							return of(true);
					}
				})
			)
			.subscribe(() => {}, error1 => console.error('Auth params: , error: ', error1));

		this.checkUser$
			.asObservable()
			.pipe(
				concatMap(() => this.authService.currentUser$),
				switchMap(user => {
					if (!!user) {
						return of(user);
					}
					const modalRef = this.modalService.open(LoginModalComponent, null, {size: 'sm'});
					return from(modalRef.result).pipe(catchError(err => (err ? throwError(err) : of(err))));
				}),
				takeUntil(this.destroy$)
			)
			.subscribe(user => {
				if (!user) {
					this.router.navigate(['']).catch(err => console.error('navigate: , err: ', err));
				} else {
					this.router.navigate(['me'], {relativeTo: this.route}).catch(err => console.error('navigate: , err: ', err));
				}
			});
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.notificationService.dismissAll();
		this.modalService.dismissAll();
	}
}
