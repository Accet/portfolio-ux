export interface WorkItem {
	url: string;
	imgUrl: string;
	date: Date;
	title: string;
	description: string;
}

export const WorksItems: WorkItem[] = [
	{
		url: 'binquit',
		imgUrl: '/assets/images/binquit.jpg',
		date: new Date('June 2019'),
		title: 'binquit',
		description:
			'Designed a web app which allows personalizing the search for quality connections between job seekers and businesses.'
	},
	{
		url: 's-care',
		imgUrl: '/assets/images/binquit.jpg',
		date: new Date('May 2019'),
		title: 'Senior Care Connect',
		description:
			'Designed an application for Senior Care Connect and delivered the prototype made in accordance with research, planning, designing, and testing regulations.'
	},
	{
		url: 'towns',
		imgUrl: '/assets/images/binquit.jpg',
		date: new Date('July 2019'),
		title: '1000 towns',
		description:
			'Designed an application for Senior Care Connect and delivered the prototype made in accordance with research, planning, designing, and testing regulations.'
	}
];
