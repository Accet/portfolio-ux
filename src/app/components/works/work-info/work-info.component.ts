import {Component, OnInit} from '@angular/core';
import {WorkItem, WorksItems} from '../../../models/works-provider';
import {Router} from '@angular/router';

@Component({
	selector: 'app-work-info',
	templateUrl: './work-info.component.html',
	styleUrls: ['./work-info.component.scss']
})
export class WorkInfoComponent implements OnInit {
	constructor(private router: Router) {}
	items: WorkItem;

	ngOnInit() {
		this.items = WorksItems.find(item => item.url === this.router.url);
	}
}
