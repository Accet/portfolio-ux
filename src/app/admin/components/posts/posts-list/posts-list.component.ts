import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';

@Component({
	selector: 'app-posts-list',
	templateUrl: './posts-list.component.html',
	styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent extends BaseObserverComponent implements OnInit {
	constructor(private route: ActivatedRoute) {
		super();
	}

	ngOnInit() {}
}
