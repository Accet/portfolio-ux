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
	get actualSpy(): Observable<ScrollSpyDirective> {
		return this._actualSpy.asObservable();
	}
	isStickied: Observable<boolean>;
	private _actualSpy: Subject<ScrollSpyDirective> = new Subject();
	@ViewChild(ScrollSpyDirective, {static: false}) set spy(component: ScrollSpyDirective) {
		this._actualSpy.next(component);
	}
	navBarMode: Observable<NavBarMode>;

	constructor(private navBarService: NavBarService) {
		super();
	}

	ngOnInit() {}

	ngAfterViewInit(): void {
		this.navBarMode = this.navBarService.navBarMode.asObservable().pipe(
			filter(val => val !== null),
			delay(0)
		);

		this.isStickied = this.actualSpy.pipe(switchMap(directive => directive.stickySet.asObservable()));
	}
}
