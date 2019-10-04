import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GoogleAnalyticsService} from '../../../../shared/services/google-analytics.service';
import {WorkItem, WorksItems} from '../../../../shared/models/works-provider';

@Component({
	selector: 'app-work-info',
	templateUrl: './work-info.component.html',
	styleUrls: ['./work-info.component.scss']
})
export class WorkInfoComponent implements OnInit {
	constructor(private router: Router, private gAnalytics: GoogleAnalyticsService) {}

	items: WorkItem;

	ngOnInit() {
		this.items = WorksItems.find(item => item.url === this.router.url);
	}

	onMedium(mediumUrl: string) {
		this.gAnalytics.sendEvent('medium_link', this.items.title, mediumUrl);
	}
}
