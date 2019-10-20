import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BaseObserverComponent} from '../../../shared/components/base-observer/base-observer.component';
import {filter, map, takeUntil} from 'rxjs/operators';

enum PostsState {
	NEW,
	LIST,
	EDIT
}

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.scss']
})
export class PostsComponent extends BaseObserverComponent implements OnInit {
	postsState = PostsState;
	currentState: PostsState;
	constructor(private route: ActivatedRoute, private router: Router) {
		super();
	}
	ngOnInit() {
		this.currentState = this.processUrl(this.router.url);
		this.router.events
			.pipe(
				takeUntil(this.destroy$),
				filter(event => event instanceof NavigationEnd),
				map(event => event as NavigationEnd)
			)
			.subscribe(event => (this.currentState = this.processUrl(event.urlAfterRedirects)));
	}

	processUrl(url: string) {
		switch (url) {
			case '/admin/posts/list':
				return PostsState.LIST;
			case '/admin/posts/new':
				return PostsState.NEW;
			default:
				return PostsState.EDIT;
		}
	}
}
