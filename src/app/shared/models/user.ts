export interface User {
	uid: string;
	email: string;
	photoURL?: string;
	displayName: string;
	contacts: {
		email: string;
		skype?: string;
		phone?: string;
	};
	social?: {
		medium?: string;
		linkedIn?: string;
		github?: string;
	};
}
