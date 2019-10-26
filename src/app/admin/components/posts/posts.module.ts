import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PostsRoutingModule} from './posts-routing.module';
import {PostsComponent} from './posts.component';
import {PostsListComponent} from './posts-list/posts-list.component';
import {PostDetailsComponent} from './post-details/post-details.component';
import {SharedModule} from '../../../shared/shared.module';
import {AdminModule} from '../../admin.module';

@NgModule({
	declarations: [PostsComponent, PostDetailsComponent, PostsListComponent, PostsListComponent, PostDetailsComponent],
	imports: [CommonModule, PostsRoutingModule, SharedModule, AdminModule]
})
export class PostsModule {}
