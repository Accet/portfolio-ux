import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {ScrollSpyDirective} from './directives/scroll-spy.directive';
import {HomeComponent} from './components/home/home.component';
import {BlurredModalDirective} from './directives/blurred-modal.directive';
import {HeaderComponent} from './components/header/header.component';
import {NavigationLinksComponent} from './components/header/navigation-links/navigation-links.component';
import {WorksComponent} from './components/works/works.component';
import {ContactComponent} from './components/contact/contact.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule} from '@angular/material';
import {FooterComponent} from './components/footer/footer.component';
import {BinquitComponent} from './components/works/binquit/binquit.component';
import {SCareComponent} from './components/works/s-care/s-care.component';
import {TownsComponent} from './components/works/towns/towns.component';
import {WorkInfoComponent} from './components/works/work-info/work-info.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CarouselComponent} from './components/carousel/carousel.component';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {
	RECAPTCHA_V3_SITE_KEY,
	RecaptchaComponent,
	RecaptchaFormsModule,
	RecaptchaModule,
	RecaptchaSettings,
	RecaptchaV3Module
} from 'ng-recaptcha';
import {RecaptchaCommonModule} from 'ng-recaptcha/recaptcha/recaptcha-common.module';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		BlurredModalDirective,
		ScrollSpyDirective,
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
	imports: [
		BrowserModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireStorageModule,
		AngularFirestoreModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AppRoutingModule,
		ReactiveFormsModule,
		RecaptchaModule,
		RecaptchaFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		NgbModule,
		MatGridListModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
