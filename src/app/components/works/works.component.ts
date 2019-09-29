import {Component, OnInit} from '@angular/core';
import {WorkItem, WorksItems} from '../../models/works-provider';

@Component({
	selector: 'app-works',
	templateUrl: './works.component.html',
	styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {
	items: WorkItem[];
	constructor() {}

	ngOnInit() {
		this.items = WorksItems;
	}
}
