import {Component, OnInit} from '@angular/core';
import {NavBarService} from '../../../shared/services/nav-bar.service';
import {NavBarMode} from '../../../shared/directives/scroll-spy.directive';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	constructor(private navService: NavBarService) {}
	ngOnInit() {
		this.navService.setNavBarMode(NavBarMode.FREE);
	}
}
