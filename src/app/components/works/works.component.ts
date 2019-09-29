import {Component, OnInit} from '@angular/core';
import {WorkItem, WorksItems} from '../../models/works-provider';
import {Router} from '@angular/router';

@Component({
	selector: 'app-works',
	templateUrl: './works.component.html',
	styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {
	items: WorkItem[];
	constructor(private router: Router) {}

	ngOnInit() {
		this.items = WorksItems;
	}

	// goToDetails(item: WorkItem) {
	// 	this.router.navigate([item.url]);
	// }
}
