import {AfterViewInit, Injectable, Injector, OnDestroy, OnInit} from '@angular/core';
import {NavBarMode} from '../../directives/scroll-spy.directive';
import {NavBarService} from '../../services/nav-bar.service';
import {BaseObserverComponent} from './base-observer.component';

@Injectable()
export abstract class BaseWork extends BaseObserverComponent implements OnDestroy, AfterViewInit {
	scrollService: NavBarService;

	protected constructor(private injectorObj: Injector) {
		super();
		this.scrollService = injectorObj.get(NavBarService);
	}

	ngOnDestroy(): void {
		this.scrollService.setNavBarMode(NavBarMode.FREE);
		window.scrollTo(0, 0);
		super.ngOnDestroy();
	}

	ngAfterViewInit(): void {
		this.scrollService.setNavBarMode(NavBarMode.STICKIED);
		window.scrollTo(0, 0);
	}
}
