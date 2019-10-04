import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WebComponent} from './web.component';
import {HomeComponent} from './components/home/home.component';
import {BinquitComponent} from './components/works/binquit/binquit.component';
import {SCareComponent} from './components/works/s-care/s-care.component';
import {TownsComponent} from './components/works/towns/towns.component';

const routes: Routes = [
	{
		path: '',
		component: WebComponent,
		children: [
			{
				path: '',
				component: HomeComponent,
				pathMatch: 'full'
			},
			{
				path: 'binqit',
				component: BinquitComponent,
				pathMatch: 'full'
			},
			{
				path: 's-care',
				component: SCareComponent,
				pathMatch: 'full'
			},
			{
				path: 'towns',
				component: TownsComponent,
				pathMatch: 'full'
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class WebRoutingModule {}
