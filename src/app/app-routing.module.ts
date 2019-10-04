import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				loadChildren: () => import('./web/web.module').then(m => m.WebModule)
			},
			{
				path: 'admin',
				loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
			}
		]
	}
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
