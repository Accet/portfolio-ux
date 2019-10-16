import {animate, animation, style, transition, trigger} from '@angular/animations';
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
