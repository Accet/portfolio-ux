import {NgModule} from '@angular/core';
import {AdminComponent} from './admin.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminNavigationComponent} from './components/admin-navigation/admin-navigation.component';
import {ProfileComponent} from './components/profile/profile.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {LoginModalComponent} from './components/login-modal/login-modal.component';
import {CapsDetectorDirective} from './directives/caps-detector.directive';
import {ModalService} from '../shared/services/modal.service';
import {BlurredModalDirective} from './directives/blurred-modal.directive';
import {ForgotPasswordModalComponent} from './components/forgot-password/forgot-password-modal.component';
import {ResetPasswordModalComponent} from './components/reset-password-modal/reset-password-modal.component';
import {AuthService} from './services/auth.service';
import {NewEmailComponent} from './components/profile/new-email/new-email.component';
import {NewPasswordComponent} from './components/profile/new-password/new-password.component';
import {UserDataComponent} from './components/profile/user-data/user-data.component';
import {DropZoneDirective} from './directives/drop-zone.directive';
import {UserFileUploadComponent} from './components/user-file-upload/user-file-upload.component';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {MatProgressSpinnerModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {ImageUploadComponent} from './components/image-upload/image-upload.component';
import {CompressorService} from './services/compressor.service';
import {RemovableImageComponent} from './components/image-upload/removable-image/removable-image.component';

@NgModule({
	declarations: [
		AdminComponent,
		AdminNavigationComponent,
		ProfileComponent,
		LoginModalComponent,
		CapsDetectorDirective,
		BlurredModalDirective,
		ForgotPasswordModalComponent,
		ResetPasswordModalComponent,
		NewEmailComponent,
		NewPasswordComponent,
		UserDataComponent,
		DropZoneDirective,
		UserFileUploadComponent,
		ImageUploadComponent,
		RemovableImageComponent
	],
	entryComponents: [LoginModalComponent, ResetPasswordModalComponent, ForgotPasswordModalComponent, AdminComponent],
	imports: [
		RouterModule,
		AdminRoutingModule,
		SharedModule,
		AngularFireAuthModule,
		MaterialFileInputModule,
		MatProgressSpinnerModule,
		CommonModule
	],
	exports: [
		LoginModalComponent,
		ResetPasswordModalComponent,
		ForgotPasswordModalComponent,
		AdminComponent,
		BlurredModalDirective,
		ImageUploadComponent,
		RemovableImageComponent
	],
	providers: [AuthService, ModalService, CompressorService]
})
export class AdminModule {}
