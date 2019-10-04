import {NgModule} from '@angular/core';
import {ScrollSpyDirective} from './directives/scroll-spy.directive';
import {BlurredModalDirective} from './directives/blurred-modal.directive';
import {CommonModule} from '@angular/common';
import {
	MatButtonModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatSnackBarModule
} from '@angular/material';
import {CustomNotificationComponent} from './components/custom-notification/custom-notification.component';
import {BrowserModule} from '@angular/platform-browser';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';

@NgModule({
	declarations: [ScrollSpyDirective, BlurredModalDirective, CustomNotificationComponent],
	imports: [
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireStorageModule,
		AngularFirestoreModule,
		HttpClientModule,
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		NgbModule,
		MatGridListModule,
		MatSnackBarModule,
		FormsModule
	],
	entryComponents: [CustomNotificationComponent],
	exports: [
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatSnackBarModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		ScrollSpyDirective,
		BlurredModalDirective,
		CommonModule,
		NgbModule
	]
})
export class SharedModule {}
