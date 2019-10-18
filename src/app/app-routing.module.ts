import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'admin',
				loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
			},
			{
				path: '',
				loadChildren: () => import('./web/web.module').then(m => m.WebModule)
			}
		]
	}
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
