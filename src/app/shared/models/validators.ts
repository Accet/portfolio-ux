import {FormControl} from '@angular/forms';
export const INVALID_STATUS = {invalid: true};
// tslint:disable-next-line:max-line-length
const EMAIL_REGEX = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export function validateEmail(control: FormControl): {[key: string]: boolean} | null {
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
