import {NgModule} from '@angular/core';
import {AdminComponent} from './admin.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminNavigationComponent} from './components/admin-navigation/admin-navigation.component';
import {PostsComponent} from './components/posts/posts.component';
import {ProfileComponent} from './components/profile/profile.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AuthService} from '../shared/services/auth.service';
import {LoginModalComponent} from './components/login-modal/login-modal.component';
import {CapsDetectorDirective} from './directives/caps-detector.directive';
import {ModalService} from '../shared/services/modal.service';
import {BlurredModalDirective} from './directives/blurred-modal.directive';
import {ForgotPasswordModalComponent} from './components/forgot-password/forgot-password-modal.component';
import {ResetPasswordModalComponent} from './components/reset-password-modal/reset-password-modal.component';

@NgModule({
	declarations: [
		AdminComponent,
		AdminNavigationComponent,
		PostsComponent,
		ProfileComponent,
		LoginModalComponent,
		CapsDetectorDirective,
		BlurredModalDirective,
		ForgotPasswordModalComponent,
		ResetPasswordModalComponent
	],
	entryComponents: [LoginModalComponent, ResetPasswordModalComponent, ForgotPasswordModalComponent, AdminComponent],
	imports: [RouterModule, AdminRoutingModule, SharedModule, AngularFireAuthModule],
	exports: [
		LoginModalComponent,
		ResetPasswordModalComponent,
		ForgotPasswordModalComponent,
		AdminComponent,
		BlurredModalDirective
	],
	providers: [AuthService, ModalService]
})
export class AdminModule {}
