import {FormControl, FormGroup} from '@angular/forms';

export class CustomValidators {
	public static validateName(c: FormControl) {
		const regex = new RegExp(/^[a-zA-Z\x7f-\xff][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]+$/g);
		if (!c.value || c.value === '') {
			return null;
		}
		if (!regex.test(c.value)) {
			return {pattern: true};
		}
		return null;
	}

	static validateEmail(c: FormControl) {
		// tslint:disable-next-line:max-line-length
		const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

		if (!c.value || c.value === '') {
			return null;
		}

		return EMAIL_REGEXP.test(c.value)
			? null
			: {
					validateEmail: {
						valid: false
					}
			  };
	}

	static checkPasswords(group: FormGroup) {
		const pass = group.controls.password.value;
		const passwordConfirm = group.controls.passwordConfirm.value;

		return pass === passwordConfirm ? null : {match: true};
	}
}
