import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavItem} from '../../../shared/utils/navigation-items-utils';
import {NavigationItemsService} from '../../services/navigation-items.service';
import {BaseObserverComponent} from '../../../shared/components/base-observer/base-observer.component';
import {take, takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {User} from '../../../shared/models/user';

@Component({
	selector: 'app-admin-navigation',
	templateUrl: './admin-navigation.component.html',
	styleUrls: ['./admin-navigation.component.scss'],
	providers: [NavigationItemsService]
})
export class AdminNavigationComponent extends BaseObserverComponent implements OnInit {
	navbarOpen = false;
	menuItems: NavItem[] = [];

	user$: Observable<User>;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private itemsService: NavigationItemsService,
		private authService: AuthService
	) {
		super();
	}

	ngOnInit() {
		this.itemsService.getMenuItems();
		this.itemsService.currentItems$.pipe(takeUntil(this.destroy$)).subscribe(menuItems => (this.menuItems = menuItems));
		this.user$ = this.authService.currentUser$;
	}

	toggleNavbar() {
		this.navbarOpen = !this.navbarOpen;
	}

	handleMenuItemSelected(url: string) {
		this.router.navigate([url], {relativeTo: this.route}).catch(error => console.log('Function: , error: ', error));
	}

	handleLogout() {
		this.authService
			.logout()
			.pipe(take(1))
			.subscribe(
				() => {
					this.router.navigate(['']).catch(err => console.log('navigate: , err: ', err));
				},
				error1 => console.log('authService.logout: , error: ', error1)
			);
	}
}
