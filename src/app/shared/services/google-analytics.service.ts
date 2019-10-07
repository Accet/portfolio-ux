import {Injectable, NgZone} from '@angular/core';
import {environment} from '../../../environments/environment';
declare let gtag;

@Injectable({
	providedIn: 'root'
})
export class GoogleAnalyticsService {
	constructor(private run: NgZone) {
		const script = document.createElement('script');
		script.async = true;
		script.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.analytics;
		document.head.prepend(script);
	}

	trackPageChange(url: string) {
		this.run.runOutsideAngular(() => {
			gtag('config', environment.analytics, {
				page_path: url
			});
		});
	}

	sendEvent(action: string, category: string = 'general', label?: string, value: number = 1) {
		this.run.runOutsideAngular(() => {
			const properties: any = {
				event_category: category,
				value,
				event_callback: () => {
					console.log('event_callback, analyticsRes: ');
				},
				event_timeout: 3000
			};
			if (label) {
				properties.event_label = label;
			}
			gtag('event', action, properties);
		});
	}
}
