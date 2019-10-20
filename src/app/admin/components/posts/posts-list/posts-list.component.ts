import {Component, OnInit} from '@angular/core';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {PostsManagerService} from '../../../../shared/services/posts-manager.service';
import {Observable} from 'rxjs';
import {Post} from '../../../../shared/models/post';
import {takeUntil} from 'rxjs/operators';

@Component({
	selector: 'app-posts-list',
	templateUrl: './posts-list.component.html',
	styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent extends BaseObserverComponent implements OnInit {
	posts$: Observable<Post[]>;
	constructor(private postsService: PostsManagerService) {
		super();
	}

	ngOnInit() {
		this.posts$ = this.postsService.getPosts;
		this.posts$.pipe(takeUntil(this.destroy$)).subscribe(val => {
			console.log('Function: , posts$: ', val);
		});
	}
}
