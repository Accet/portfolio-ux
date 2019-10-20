import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PostsComponent} from './posts.component';
import {PostsListComponent} from './posts-list/posts-list.component';
import {PostDetailsComponent} from './post-details/post-details.component';

const routes: Routes = [
	{
		path: '',
		component: PostsComponent,
		data: {animation: 'posts'},
		children: [
			{path: 'list', component: PostsListComponent},
			{path: 'new', component: PostDetailsComponent},
			{path: ':id', component: PostDetailsComponent},
			{path: '', redirectTo: 'list', pathMatch: 'full'}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PostsRoutingModule {}
