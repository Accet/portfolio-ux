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
			{path: 'me', component: ProfileComponent, data: {animation: 'me'}},
			{
				path: 'posts',
				component: PostsComponent,
				pathMatch: 'full',
				data: {animation: 'posts'}
			},
			{
				path: '',
				redirectTo: 'me',
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
