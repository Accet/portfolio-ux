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
		super.ngOnDestroy();
		this.scrollService.lockNavBar(NavBarMode.FREE);
	}

	ngAfterViewInit(): void {
		this.scrollService.lockNavBar(NavBarMode.STICKIED);
		window.scrollTo(0, 0);
	}
}
