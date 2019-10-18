import {animate, animateChild, animation, group, query, style, transition, trigger} from '@angular/animations';
export const verticalIn = animation([
	style({transform: 'translateY(-100%)', opacity: 0, height: 0}),
	animate(
		'{{ time }} cubic-bezier(.8, -0.6, 0.2, 1.5)',
		style({transform: 'translateY(0)', opacity: 1, height: 'auto'})
	)
]);
export const verticalOut = animation([
	style({transform: 'translateY(0)', opacity: 1, height: 'auto'}),
	animate('{{ time }} cubic-bezier(.8, -0.6, 0.2, 1.5)', style({transform: 'translateY(-100%)', opacity: 0, height: 0}))
]);

// Routable animations
export const slideInAnimation = animation([
	style({position: 'relative'}),
	query(':enter, :leave', [
		style({
			position: 'absolute',
			left: 0,
			width: '100%'
		})
	]),
	query(':enter', [style({left: '-100%'})]),
	query(':leave', animateChild()),
	group([
		query(':leave', [animate('300ms ease-out', style({left: '100%'}))]),
		query(':enter', [animate('300ms ease-out', style({left: '0%'}))])
	]),
	query(':enter', animateChild())
]);

export const slideOutAnimation = animation([
	style({position: 'relative'}),
	query(':enter, :leave', [
		style({
			position: 'absolute',
			left: 0,
			width: '100%'
		})
	]),
	query(':enter', [style({left: '100%'})]),
	query(':leave', animateChild()),
	group([
		query(':leave', [animate('300ms ease-out', style({left: '-100%'}))]),
		query(':enter', [animate('300ms ease-out', style({left: '0%'}))])
	]),
	query(':enter', animateChild())
]);
