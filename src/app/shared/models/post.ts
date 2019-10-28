export interface Post {
	id: string;
	title: string;
	description: string;
	createdOn: number;
	modifiedOn?: number;
	thumbImg?: {
		url: string;
		path: string;
	};
	headerImg?: {
		url: string;
		path: string;
	};
	mediumLink?: string;
	role?: string;
	timeline?: string;
	prototypeLink?: string;
	author_uid?: string;
}
