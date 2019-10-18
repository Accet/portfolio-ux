import {NgModule} from '@angular/core';
import {NotFoundComponent} from './not-found.component';
import {SharedModule} from '../../shared.module';
import {CommonModule} from '@angular/common';
import {NotFoundRoutingModule} from './not-found-routing.module';

@NgModule({
	declarations: [NotFoundComponent],
	exports: [NotFoundComponent],
	imports: [SharedModule, CommonModule, NotFoundRoutingModule]
})
export class NotFoundModule {}
