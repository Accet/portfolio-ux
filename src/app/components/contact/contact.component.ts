import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {BaseObserverComponent} from '../base-observer/base-observer.component';
import {validateEmail} from '../../models/validators';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {NotificationService} from '../../services/notification.service';
import {GoogleAnalyticsService} from '../../services/google-analytics.service';

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss']
})
export class ContactComponent extends BaseObserverComponent implements OnInit {
	emailFirst = 'tatyana.arkhypchuk';
	emailSecond = '@gmail.com';
	contactForm: FormGroup;
	disabledSubmit: BehaviorSubject<boolean> = new BehaviorSubject(true);

	RECAPTCHA_KEY = environment.recaptcha;
	constructor(
		private db: AngularFirestore,
		private fb: FormBuilder,
		private notificationService: NotificationService,
		private gAnalytics: GoogleAnalyticsService
	) {
		super();
	}

	static markFormFieldsAsDirty(form: FormGroup): void {
		Object.keys(form.controls).forEach(field => {
			const control = form.get(field);
			control.markAsTouched({onlySelf: true});
		});
	}

	ngOnInit() {
		this.initForm();
		this.contactForm.statusChanges
			.pipe(
				takeUntil(this.destroy$),
				tap(state => this.disabledSubmit.next(state === 'INVALID'))
			)
			.subscribe();
	}

	initForm() {
		this.contactForm = this.fb.group({
			name: ['', [Validators.required]],
			subject: ['', []],
			email: ['', [Validators.required, validateEmail]],
			message: ['', Validators.required],
			recaptchaReactive: [null, Validators.required]
		});
	}

	onSend(formData: any, formDirective: FormGroupDirective) {
		ContactComponent.markFormFieldsAsDirty(this.contactForm);
		if (!this.contactForm.valid) {
			return;
		}
		const {name, email, message, subject} = this.contactForm.value;
		const date = Date();
		const html = `
<div>From: ${name}</div>
<div>Email: <a href="mailto:${email}">${email}</a></div>
<div>Subject: ${subject}</div>
<div>Date: ${date}</div>
<div>Message: ${message}</div>
`;
		const formRequest = {name, email, message, date, subject, html};
		this.db
			.collection('/messages')
			.add(formRequest)
			.then(() => {
				this.disabledSubmit.next(true);
				this.contactForm.reset();
				this.notificationService.showSuccess({message: 'Your message sent!', duration: 3000});
				formDirective.resetForm();
				this.contactForm.reset({}, {emitEvent: false});
				this.gAnalytics.sendEvent('contact_me', 'success');
			})
			.catch(error => {
				this.gAnalytics.sendEvent('contact_me', 'failed', error.message);
				this.notificationService.showError({
					message: 'Something went wrong. Try again later, please.',
					enableClose: true
				});
				console.log('Function: , error: ', error);
			});
	}
}
