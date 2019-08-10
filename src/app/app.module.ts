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

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		BlurredModalDirective,
		ScrollSpyDirective,
		HeaderComponent,
		NavigationLinksComponent
	],
	imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
