import {FormControl, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class FormUtils {
	public static markFormFieldsAsDirty(form: FormGroup): void {
		Object.keys(form.controls).forEach(field => {
			const control = form.get(field);
			control.markAsTouched({onlySelf: true});
			if (control['controls']) {
				Object.keys(control['controls']).forEach(child => {
					control.get(child).markAsTouched({onlySelf: true});
				});
			}
		});
	}

	public static compareFn(val1: any, val2: any) {
		return val1 && val2 ? val1.name === val2.name : val1 === val2;
	}
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const invalidCtrl = !!(control && control.invalid && control.touched && control.parent.dirty);
		const invalidParent = !!(
			control &&
			control.parent &&
			control.touched &&
			control.parent.invalid &&
			control.parent.dirty
		);

		return invalidCtrl || invalidParent;
	}
}
