export interface User {
	uid: string;
	email: string;
	photoURL?: {
		url: string;
		path: string;
	};
	displayName: string;
	resume?: {
		url: string;
		path: string;
	};
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
