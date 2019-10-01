import {Component, ElementRef, Injector, OnInit, Renderer2, ViewChild} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BaseWork} from '../../base-observer/base-work';
import {Router} from '@angular/router';
import {GoogleAnalyticsService} from '../../../services/google-analytics.service';
import {WorkItem, WorksItems} from '../../../models/works-provider';

@Component({
	selector: 'app-towns',
	templateUrl: './towns.component.html',
	styleUrls: ['./towns.component.scss']
})
export class TownsComponent extends BaseWork implements OnInit {
	_headerSection: ElementRef;
	_placeholderSection: ElementRef;
	_headerSection$: Subject<ElementRef> = new Subject();
	_placeholderSection$: Subject<ElementRef> = new Subject();

	@ViewChild('head', {static: false}) set headerSection(element: ElementRef) {
		this._headerSection$.next((this._headerSection = element));
	}
	@ViewChild('placeholder', {static: false}) set placeholderSection(element: ElementRef) {
		this._placeholderSection$.next((this._placeholderSection = element));
	}
	items: WorkItem;

	constructor(
		private injector: Injector,
		private renderer: Renderer2,
		private router: Router,
		private gAnalytics: GoogleAnalyticsService
	) {
		super(injector);
	}
	ngOnInit() {
		this.items = WorksItems.find(item => item.url === this.router.url);

		fromEvent(window, 'resize')
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				if (this._headerSection && this._placeholderSection) {
					this.renderer.setStyle(
						this._placeholderSection.nativeElement,
						'min-height',
						`${this._headerSection.nativeElement.offsetHeight - 130}px`
					);
				}
			});
	}

	adjustSize() {
		this.renderer.setStyle(
			this._placeholderSection.nativeElement,
			'min-height',
			`${this._headerSection.nativeElement.offsetHeight - 130}px`
		);
	}

	onSendEvent(name: string) {
		this.gAnalytics.sendEvent(name, 'towns');
	}
}
