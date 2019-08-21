import {CarouselData} from './carousel-data';

export interface WorkItem {
	url: string;
	imgUrl: string;
	date: Date;
	title: string;
	description: string;
	role: string;
	timeline: string;
	fullTitle: string;
	mediumUrl?: string;
	carousel?: CarouselData[];
}

export const WorksItems: WorkItem[] = [
	{
		url: '/binquit',
		imgUrl: '/assets/images/binquit.jpg',
		date: new Date('June 2019'),
		title: 'binquit',
		fullTitle: 'Binqit - Part-Time Job Search Web-App',
		description:
			'Designed a web app which allows personalizing the search for quality connections between job seekers and businesses.',
		role: 'UX Designer',
		timeline: '3 Weeks',
		mediumUrl: 'https://medium.com',
		carousel: [
			{
				url: '/assets/images/binquit-persona-1.png',
				alt: 'First design persona story'
			},
			{
				url: '/assets/images/binquit-persona-2.png',
				alt: 'Second design persona story'
			}
		]
	},
	{
		url: '/s-care',
		imgUrl: '/assets/images/binquit.jpg',
		date: new Date('May 2019'),
		title: 'Senior Care Connect',
		fullTitle: '',
		description:
			'Designed an application for Senior Care Connect and delivered the prototype made in accordance with research, planning, designing, and testing regulations.',
		role: 'UX Designer',
		timeline: '3 Weeks',
		mediumUrl: 'https://medium.com',
		carousel: [
			{
				url: '/assets/images/s-care-persona-1.jpg',
				alt: 'First design persona story'
			},
			{
				url: '/assets/images/s-care-persona-2.png',
				alt: 'Second design persona story'
			}
		]
	},
	{
		url: '/towns',
		imgUrl: '/assets/images/binquit.jpg',
		date: new Date('July 2019'),
		fullTitle: '',
		title: '1000 towns',
		description:
			'Designed an application for Senior Care Connect and delivered the prototype made in accordance with research, planning, designing, and testing regulations.',
		role: 'UX Designer',
		timeline: '3 Weeks',
		mediumUrl: ''
	}
];
