import {FormControl, FormGroup} from '@angular/forms';

export const INVALID_STATUS = {invalid: true};
// tslint:disable-next-line:max-line-length
const EMAIL_REGEX = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

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

	static validateEmail(control: FormControl) {
		// tslint:disable-next-line:max-line-length
		const email = control.value;
		if (!email) {
			return INVALID_STATUS;
		}

		if (email.length > 256) {
			return INVALID_STATUS;
		}

		if (!EMAIL_REGEX.test(email)) {
			return INVALID_STATUS;
		}

		const parts = email.split('@');
		if (parts[0].length > 64) {
			return INVALID_STATUS;
		}

		const domainParts = parts[1].split('.');
		if (domainParts.some((part: string) => part.length > 63)) {
			return INVALID_STATUS;
		}
		return null;
	}

	static checkPasswords(group: FormGroup) {
		const pass = group.controls.password.value;
		const passwordConfirm = group.controls.passwordConfirm.value;

		return pass === passwordConfirm ? null : {match: true};
	}

	static validateMobile(c: FormControl) {
		const E164_REGEXP = /^\+{1}[1-9]\d{1,14}$/g;

		if (!c.value || c.value === '') {
			return null;
		}

		return E164_REGEXP.test(c.value)
			? null
			: {
					valid: false
			  };
	}
}
