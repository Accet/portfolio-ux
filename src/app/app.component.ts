import {Component, NgZone, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {AngularFirestore} from '@angular/fire/firestore';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {GoogleAnalyticsService} from './shared/services/google-analytics.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(
		db: AngularFirestore,
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
		private router: Router,
		private run: NgZone,
		private gAnalytics: GoogleAnalyticsService
	) {
		['linked', 'medium', 'mail', 'media', 'download', 'arrow_forward', 'cv', 'hide', 'show'].forEach(icon => {
			this.matIconRegistry.addSvgIcon(
				icon,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`)
			);
		});

		this.router.events
			.pipe(
				filter(event => event instanceof NavigationEnd),
				map(val => val as NavigationEnd)
			)
			.subscribe(event => gAnalytics.trackPageChange(event.urlAfterRedirects));
	}

	ngOnInit(): void {}
}
