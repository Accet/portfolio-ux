import {AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {BehaviorSubject, Observable} from 'rxjs';
import {NavBarMode, ScrollSpyDirective} from './directives/scroll-spy.directive';
import {AngularFirestore} from '@angular/fire/firestore';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {GoogleAnalyticsService} from './services/google-analytics.service';
import {NavBarService} from './services/nav-bar.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
	isStickied: BehaviorSubject<boolean> = new BehaviorSubject(false);
	@ViewChild(ScrollSpyDirective, {static: false}) spy: ScrollSpyDirective;
	navBarMode: Observable<NavBarMode>;

	constructor(
		db: AngularFirestore,
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
		private router: Router,
		private run: NgZone,
		private gAnalytics: GoogleAnalyticsService,

		private navBarService: NavBarService
	) {
		['linked', 'medium', 'mail', 'medium-green', 'download', 'arrow_forward', 'cv'].forEach(icon => {
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

	ngOnInit() {
		this.navBarMode = this.navBarService.isStickied.asObservable();
	}

	ngAfterViewInit(): void {
		this.spy.stickySet.asObservable().subscribe(state => this.isStickied.next(state));
	}
}
