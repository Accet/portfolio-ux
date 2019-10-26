export interface Post {
	id: string;
	title: string;
	description: string;
	date: string;
	previewImg?: {
		url: string;
		path: string;
	};
	headImg?: {
		url: string;
		path: string;
	};
	mediumLink?: string;
	role?: string;
	timeline?: string;
	prototypeLink?: string;
	author_uid?: string;
}
