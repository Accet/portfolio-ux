import {NgModule} from '@angular/core';
import {AdminComponent} from './admin.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {AdminRoutingModule} from './admin-routing.module';

@NgModule({
	declarations: [AdminComponent],
	entryComponents: [AdminComponent],
	imports: [RouterModule, AdminRoutingModule, SharedModule],
	exports: [AdminComponent],
	providers: []
})
export class AdminModule {}
