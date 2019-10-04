import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	isStickied$: BehaviorSubject<boolean> = new BehaviorSubject(true);
	@Input() set isStickied(val) {
		if (val === false || val === true) {
			this.isStickied$.next(val);
		}
	}
	navBarOpen = false;

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		if (event.target.innerWidth >= 992 && this.navBarOpen) {
			this.navBarOpen = false;
		}
	}

	constructor(private router: Router) {}

	ngOnInit() {}

	toggleNavbar(): void {
		this.navBarOpen = !this.navBarOpen;
	}

	scrollToTop(): void {
		window.scroll(0, 0);
	}

	handleNavItemActivated(): void {
		this.navBarOpen = false;
	}

	goToDashboard() {
		this.router.navigate(['admin']).catch(error => console.log('Function: , error: ', error));
	}
}
