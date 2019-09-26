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
		imgUrl: './assets/images/binquit.jpg',
		date: new Date(2019, 5),
		title: 'binquit',
		fullTitle: 'Binqit - Part-Time Job Search Web-App',
		description:
			'Designed a web app which allows personalizing the search for quality connections between job seekers and businesses.',
		role: 'UX Designer',
		timeline: '3 Weeks',
		mediumUrl: 'https://medium.com/@tanyaarkhypchuk/part-time-job-search-ux-case-study-ca9c188c2fd4',
		carousel: [
			{
				url: './assets/images/binquit-persona-1.jpg',
				alt: 'First design persona story'
			},
			{
				url: './assets/images/binquit-persona-2.jpg',
				alt: 'Second design persona story'
			}
		]
	},
	{
		url: '/s-care',
		imgUrl: './assets/images/s-care.jpg',
		date: new Date(2019, 4),
		title: 'Senior Care Connect',
		fullTitle: 'Senior Care Connect - Caregiver Service',
		description:
			'Designed an application for Senior Care Connect and delivered the prototype made in accordance with research, planning, designing, and testing regulations.',
		role: 'UX Designer',
		timeline: '3 Weeks',
		mediumUrl: 'https://medium.com/@tanyaarkhypchuk/caregiver-services-ux-case-study-ecda4e8f3c9c',
		carousel: [
			{
				url: './assets/images/s-care-persona-2.jpg',
				alt: 'First design persona story for Senior Care connect mobile application. UX research'
			},
			{
				url: './assets/images/s-care-persona-1.jpg',
				alt: 'Second design persona story for Senior Care connect mobile application. UX research'
			}
		]
	},
	{
		url: '/towns',
		imgUrl: './assets/images/towns.jpg',
		date: new Date(2019, 7),
		fullTitle: '1000 Towns of Canada',
		title: '1000 towns',
		description:
			'Redesigned one of a kind online utility and website which allows users with diverse backgrounds and interests to find unique small towns and exciting destinations all over Canada.',
		role: 'UX Designer',
		timeline: '3 Weeks',
		mediumUrl: 'https://medium.com/@tanyaarkhypchuk/explore-small-towns-ux-case-study-3bfe07adb1ce',
		carousel: [
			{
				url: './assets/images/towns-persona-1.jpg',
				alt: 'First design persona story for 1000 towns of Canada. UX research'
			},
			{
				url: './assets/images/towns-persona-2.jpg',
				alt: 'Second design persona story for 1000 towns of Canada. UX research'
			}
		]
	}
];
