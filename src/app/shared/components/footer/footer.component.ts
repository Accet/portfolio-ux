import {Component, OnInit} from '@angular/core';
import {GoogleAnalyticsService} from '../../services/google-analytics.service';
import {Observable} from 'rxjs';
import {User} from '../../models/user';
import {UserDataManagerService} from '../../services/user-data-manager.service';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	user$: Observable<User>;
	year: number;
	constructor(private gAnalytics: GoogleAnalyticsService, private userService: UserDataManagerService) {}

	ngOnInit() {
		this.user$ = this.userService.userInfo$;
		this.year = new Date().getFullYear();
	}

	sendEvent(event: string) {
		this.gAnalytics.sendEvent(event);
	}
}
