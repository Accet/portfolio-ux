import {Component, OnInit} from '@angular/core';
import {GoogleAnalyticsService} from '../../services/google-analytics.service';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	constructor(private gAnalytics: GoogleAnalyticsService) {}

	ngOnInit() {}

	sendEvent(event: string) {
		this.gAnalytics.sendEvent(event);
	}
}
