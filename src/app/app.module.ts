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
import {
	MatButtonModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatSnackBarModule
} from '@angular/material';
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
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';
import {CustomNotificationComponent} from './components/custom-notification/custom-notification.component';

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
		CarouselComponent,
		CustomNotificationComponent
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
		MatGridListModule,
		MatSnackBarModule
	],
	providers: [],
	entryComponents: [CustomNotificationComponent],
	bootstrap: [AppComponent]
})
export class AppModule {}
