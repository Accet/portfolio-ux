import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {BaseObserverComponent} from '../../base-observer/base-observer.component';
import {CommunicationService, MessageType} from '../../../services/communication.service';

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

	constructor(private communicationService: CommunicationService, private router: Router) {
		super();
	}

	ngOnInit() {
		this.communicationService
			.getMessage(MessageType.HIGHLIGHT_SCROLL_SECTION)
			.pipe(takeUntil(this.destroy$))
			.subscribe((section: any) => {
				this.setActiveNavLink(section);
			});
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
		const link = document.createElement('a');
		link.href = 'https://store-cv-arkhypchuk.s3.amazonaws.com/cv/tanya_arkhypchuk_cv.pdf';
		link.target = '_blank';
		link.click();
	}
}
