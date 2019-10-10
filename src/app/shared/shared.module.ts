import {NgModule} from '@angular/core';
import {ScrollSpyDirective} from './directives/scroll-spy.directive';
import {CommonModule} from '@angular/common';
import {
	MatButtonModule,
	MatDividerModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatSnackBarModule
} from '@angular/material';
import {CustomNotificationComponent} from './components/custom-notification/custom-notification.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';

@NgModule({
	declarations: [ScrollSpyDirective, CustomNotificationComponent],
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
		MatDividerModule,
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
		CommonModule,
		MatDividerModule,
		NgbModule
	]
})
export class SharedModule {}
