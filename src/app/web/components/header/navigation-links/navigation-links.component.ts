import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {take, takeUntil, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {CommunicationService, MessageType} from '../../../../shared/services/communication.service';
import {GoogleAnalyticsService} from '../../../../shared/services/google-analytics.service';
import {UserDataManagerService} from '../../../../shared/services/user-data-manager.service';
import {Observable} from 'rxjs';
import {User} from '../../../../shared/models/user';

interface HomeLink {
	linkText: string;
	linkTo: string;
	selected: boolean;
	section?: string;
}

@Component({
	selector: 'app-navigation-links',
	templateUrl: './navigation-links.component.html',
	styleUrls: ['./navigation-links.component.scss']
})
export class NavigationLinksComponent extends BaseObserverComponent implements OnInit {
	@Input() navMode: 'navbar-nav' | 'nav';
	@Output() navItemSelected: EventEmitter<any> = new EventEmitter<any>();
	@Input() isLoggedIn = false;

	user$: Observable<User>;

	links: HomeLink[] = [
		{
			linkText: 'About Me',
			linkTo: 'about',
			selected: false,
			section: 'about'
		},
		{
			linkText: 'My Works',
			linkTo: 'works',
			selected: false,
			section: 'works'
		},
		{
			linkText: 'Contact me',
			linkTo: 'contact',
			selected: false,
			section: 'contact'
		}
	];

	constructor(
		private communicationService: CommunicationService,
		private router: Router,
		private gAnalytics: GoogleAnalyticsService,
		private userService: UserDataManagerService
	) {
		super();
	}

	ngOnInit() {
		this.communicationService
			.getMessage(MessageType.HIGHLIGHT_SCROLL_SECTION)
			.pipe(takeUntil(this.destroy$))
			.subscribe((section: any) => {
				this.setActiveNavLink(section);
			});
		this.user$ = this.userService.userInfo$;
	}

	handleScrollToSection(section: string): void {
		this.communicationService.sendMessage({
			type: MessageType.SCROLL_TO_SECTION,
			data: section
		});
		this.setActiveNavLink(section);
		this.navItemSelected.emit(section);
	}

	setActiveNavLink(section: string): void {
		this.links.forEach((link: HomeLink) => {
			link.selected = link.linkTo === section;
		});
	}

	onDownload() {
		this.gAnalytics.sendEvent('download_cv');

		this.user$
			.pipe(
				take(1),
				tap(user => {
					console.log('Function: , user: ', user);
					const link = document.createElement('a');
					link.href = user && user.resume ? user.resume.url : '';
					link.target = '_blank';
					link.click();
				})
			)
			.subscribe(() => {}, () => {});
	}
}
