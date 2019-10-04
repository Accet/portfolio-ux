import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {WebComponent} from './web.component';
import {WebRoutingModule} from './web-routing.module';
import {HomeComponent} from './components/home/home.component';
import {FooterComponent} from '../shared/components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {ContactComponent} from './components/contact/contact.component';
import {WorksComponent} from './components/works/works.component';
import {NavigationLinksComponent} from './components/header/navigation-links/navigation-links.component';
import {BinquitComponent} from './components/works/binquit/binquit.component';
import {SCareComponent} from './components/works/s-care/s-care.component';
import {TownsComponent} from './components/works/towns/towns.component';
import {WorkInfoComponent} from './components/works/work-info/work-info.component';
import {CarouselComponent} from './components/carousel/carousel.component';
import {SharedModule} from '../shared/shared.module';
import {RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';

@NgModule({
	declarations: [
		WebComponent,
		HomeComponent,
		HeaderComponent,
		NavigationLinksComponent,
		WorksComponent,
		ContactComponent,
		FooterComponent,
		BinquitComponent,
		SCareComponent,
		TownsComponent,
		WorkInfoComponent,
		CarouselComponent
	],
	entryComponents: [WebComponent],
	imports: [RouterModule, WebRoutingModule, SharedModule, RecaptchaModule, RecaptchaFormsModule],
	exports: [WebComponent],
	providers: []
})
export class WebModule {}
