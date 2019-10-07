import {Injectable} from '@angular/core';
import {NavigationItemsUtils, NavItem} from '../../shared/utils/navigation-items-utils';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {take} from 'rxjs/operators';

@Injectable()
export class NavigationItemsService {
	get currentItems$(): Observable<NavItem[]> {
		return this._currentItems$.asObservable();
	}
	get currentItems(): NavItem[] {
		return this._currentItems;
	}

	set currentItems(value: NavItem[]) {
		this._currentItems = value;
		this._currentItems$.next(value);
	}
	private _currentItems$: ReplaySubject<NavItem[]> = new ReplaySubject(1);
	private _currentItems: NavItem[] = [];

	constructor(private router: Router) {
		combineLatest([router.events, this._currentItems$.pipe(take(1))]).subscribe(([event, items]) => {
			if (event instanceof NavigationEnd) {
				const currentItemIndex = items.findIndex(item => event.url.includes(item.url));
				items = items.map(item => {
					item.selected = false;
					return item;
				});
				if (currentItemIndex >= 0) {
					items[currentItemIndex].selected = true;
				}
				this.currentItems = items;
			}
		});
	}

	getMenuItems(id?: string): NavItem[] {
		return (this.currentItems = NavigationItemsUtils.getNavItems(id));
	}
}
