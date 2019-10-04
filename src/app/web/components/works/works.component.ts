import {Component, OnInit} from '@angular/core';
import {WorkItem, WorksItems} from '../../../shared/models/works-provider';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
	selector: 'app-works',
	templateUrl: './works.component.html',
	styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {
	items: WorkItem[];
	constructor(private router: Router, private route: ActivatedRoute) {}

	ngOnInit() {
		this.items = WorksItems;
	}

	goTo(url: string) {
		this.router.navigate([url], {relativeTo: this.route}).catch(error => console.log('Function: , error: ', error));
	}
}
