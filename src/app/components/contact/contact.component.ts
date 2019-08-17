import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseObserverComponent} from '../base-observer/base-observer.component';
import {validateEmail} from '../../models/validators';

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss']
})
export class ContactComponent extends BaseObserverComponent implements OnInit {
	constructor(private fb: FormBuilder) {
		super();
	}
	contactForm: FormGroup;

	static markFormFieldsAsDirty(form: FormGroup): void {
		Object.keys(form.controls).forEach(field => {
			const control = form.get(field);
			control.markAsTouched({onlySelf: true});
		});
	}

	ngOnInit() {
		this.initForm();
	}

	initForm() {
		this.contactForm = this.fb.group({
			name: ['', [Validators.required]],
			subject: ['', []],
			email: ['', [Validators.required, validateEmail]],
			message: ['', Validators.required]
		});
	}

	onSend() {
		ContactComponent.markFormFieldsAsDirty(this.contactForm);
		console.log('Function: onSend, , this.contactForm: ', this.contactForm);
		if (!this.contactForm.valid) {
			return;
		}
		const values = this.contactForm.value;
		console.log('Function: onSend, values: ', values);
	}
}
