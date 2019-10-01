import {Injectable} from '@angular/core';
import {NavBarMode} from '../directives/scroll-spy.directive';
import {BehaviorSubject} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NavBarService {
	isStickied: BehaviorSubject<NavBarMode> = new BehaviorSubject(NavBarMode.FREE);

	constructor() {}

	lockNavBar(state: NavBarMode) {
		this.isStickied.next(state);
	}
}
