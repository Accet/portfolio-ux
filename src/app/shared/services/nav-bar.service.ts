import {Injectable} from '@angular/core';
import {NavBarMode} from '../directives/scroll-spy.directive';
import {BehaviorSubject} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NavBarService {
	navBarMode: BehaviorSubject<NavBarMode> = new BehaviorSubject(NavBarMode.FREE);

	constructor() {}

	setNavBarMode(state: NavBarMode) {
		this.navBarMode.next(state);
	}
}
