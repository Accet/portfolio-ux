import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserAnimationsModule, BrowserModule, HttpClientModule, AppRoutingModule, SharedModule],
	providers: [],
	entryComponents: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
