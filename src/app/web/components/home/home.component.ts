import {Component, OnInit} from '@angular/core';
import {NavBarService} from '../../../shared/services/nav-bar.service';
import {NavBarMode} from '../../../shared/directives/scroll-spy.directive';
import {UserDataManagerService} from '../../../shared/services/user-data-manager.service';
import {Observable} from 'rxjs';
import {User} from '../../../shared/models/user';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	constructor(private navService: NavBarService, private userService: UserDataManagerService) {}
	user$: Observable<User>;

	ghostLinesAbout: any[] = new Array(4);
	ghostLinesObjectives: any[] = new Array(2);

	ngOnInit() {
		this.navService.setNavBarMode(NavBarMode.FREE);
		this.user$ = this.userService.userInfo$;
	}
}
