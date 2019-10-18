import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {PostsComponent} from './components/posts/posts.component';
import {ProfileComponent} from './components/profile/profile.component';

const routes: Routes = [
	{
		path: '',
		component: AdminComponent,
		children: [
			{path: '', component: ProfileComponent},
			{
				path: 'posts',
				component: PostsComponent,
				pathMatch: 'full'
			},
			{
				path: 'me',
				component: ProfileComponent,
				pathMatch: 'full'
			},
			{
				path: '**',
				loadChildren: () => import('../shared/components/not-found/not-found.module').then(m => m.NotFoundModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule {}
