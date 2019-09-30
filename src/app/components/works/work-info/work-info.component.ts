import {Component, OnInit} from '@angular/core';
import {WorkItem, WorksItems} from '../../../models/works-provider';
import {Router} from '@angular/router';
import {GoogleAnalyticsService} from '../../../services/google-analytics.service';

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
