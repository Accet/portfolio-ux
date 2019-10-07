import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {BaseObserverComponent} from '../shared/components/base-observer/base-observer.component';
import {catchError, switchMap, takeUntil} from 'rxjs/operators';
import {ModalService} from '../shared/services/modal.service';
import {from, iif, of, throwError} from 'rxjs';
import {LoginModalComponent} from './components/login-modal/login-modal.component';
import {Router} from '@angular/router';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends BaseObserverComponent implements OnInit, OnDestroy {
	constructor(private authService: AuthService, private modalService: ModalService, private router: Router) {
		super();
	}

	ngOnInit() {
		this.authService.currentUser$
			.pipe(
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
					this.router.navigate(['']).catch(err => console.log('navigate: , err: ', err));
				}
			});
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.modalService.dismissAll();
	}
}
