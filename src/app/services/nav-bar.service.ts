import {Injectable} from '@angular/core';
import {NavBarMode} from '../directives/scroll-spy.directive';
import {BehaviorSubject} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NavBarService {
	currentMode: NavBarMode = NavBarMode.FREE;
	isStickied: BehaviorSubject<boolean> = new BehaviorSubject(false);

	constructor() {}

	lockNavBar(state: NavBarMode) {
		this.currentMode = state;
		switch (state) {
			case NavBarMode.OPEN:
				this.isStickied.next(false);
				break;
			case NavBarMode.STICKIED:
				this.isStickied.next(true);
				break;
			default:
				break;
		}
	}
}
