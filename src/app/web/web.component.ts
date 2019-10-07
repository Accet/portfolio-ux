import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {NavBarMode, ScrollSpyDirective} from '../shared/directives/scroll-spy.directive';
import {NavBarService} from '../shared/services/nav-bar.service';
import {BaseObserverComponent} from '../shared/components/base-observer/base-observer.component';
import {delay, filter, switchMap} from 'rxjs/operators';

@Component({
	selector: 'app-web',
	templateUrl: './web.component.html',
	styleUrls: ['./web.component.scss']
})
export class WebComponent extends BaseObserverComponent implements OnInit, AfterViewInit {
	private _actualSpy: Subject<ScrollSpyDirective> = new Subject();
	get actualSpy(): Observable<ScrollSpyDirective> {
		return this._actualSpy.asObservable();
	}
	isStickied: Observable<boolean>;
	@ViewChild(ScrollSpyDirective, {static: false})
	set spy(component: ScrollSpyDirective) {
		this._actualSpy.next(component);
	}
	navBarMode: Observable<NavBarMode>;

	constructor(private navBarService: NavBarService) {
		super();
	}

	ngOnInit() {
		this.isStickied = this.actualSpy.pipe(switchMap(directive => directive.stickySet.asObservable()));
	}

	ngAfterViewInit(): void {
		this.navBarMode = this.navBarService.navBarMode.asObservable().pipe(
			filter(val => val !== null),
			delay(0)
		);
	}
}
