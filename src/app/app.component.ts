import {AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {ScrollSpyDirective} from './directives/scroll-spy.directive';
import {AngularFirestore} from '@angular/fire/firestore';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {GoogleAnalyticsService} from './services/google-analytics.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
	isStickied: Observable<boolean>;
	@ViewChild(ScrollSpyDirective, {static: false}) spy: ScrollSpyDirective;

	constructor(
		db: AngularFirestore,
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
		private router: Router,
		private run: NgZone,
		private gAnalytics: GoogleAnalyticsService
	) {
		['linked', 'medium', 'mail', 'media', 'download', 'arrow_forward', 'cv'].forEach(icon => {
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

	ngOnInit() {}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.isStickied = this.spy.stickySet.asObservable();
		});
	}
}
