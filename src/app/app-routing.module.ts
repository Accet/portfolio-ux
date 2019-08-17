import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {BinquitComponent} from './components/works/binquit/binquit.component';
import {SCareComponent} from './components/works/s-care/s-care.component';
import {TownsComponent} from './components/works/towns/towns.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'binquit',
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
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
