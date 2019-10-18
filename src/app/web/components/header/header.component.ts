import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserDataManagerService} from '../../../shared/services/user-data-manager.service';
import {User} from '../../../shared/models/user';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	isStickied$: BehaviorSubject<boolean> = new BehaviorSubject(true);

	user$: Observable<User>;

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

	constructor(private router: Router, private userService: UserDataManagerService) {}

	ngOnInit() {
		this.user$ = this.userService.userInfo$;
	}

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
