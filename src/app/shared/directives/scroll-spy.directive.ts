import {
	AfterViewInit,
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnDestroy,
	Output
} from '@angular/core';
import {Router} from '@angular/router';
import {concatMap, delay, scan, switchMap, takeUntil, takeWhile} from 'rxjs/operators';
import {CommunicationService, MessageType} from '../services/communication.service';
import {BaseObserverComponent} from '../components/base-observer/base-observer.component';
import {combineLatest, from, interval, of} from 'rxjs';
import {isBoolean} from 'util';

export enum NavBarMode {
	STICKIED,
	OPEN,
	FREE
}

@Directive({
	selector: '[appScrollSpy]'
})
export class ScrollSpyDirective extends BaseObserverComponent implements OnDestroy, AfterViewInit {
	get isStickied(): boolean {
		return this._isStickied;
	}

	set isStickied(value: boolean) {
		this.stickySet.emit((this._isStickied = value));
	}

	@Input() stickyOffset = 45;
	@Input() set navBarMode(navBarMode: NavBarMode) {
		if (navBarMode === null) {
			return;
		}
		this._navBarMode = navBarMode;
		this.isStickied = !isBoolean(this.isStickied) && navBarMode === NavBarMode.FREE && window.pageYOffset > 140;

		switch (navBarMode) {
			case NavBarMode.OPEN:
				this.isStickied = false;
				break;
			case NavBarMode.STICKIED:
				this.isStickied = true;
				break;
			default:
				break;
		}
	}

	get navBarMode(): NavBarMode {
		return this._navBarMode;
	}

	@Output() stickySet: EventEmitter<boolean> = new EventEmitter<boolean>();

	private _isStickied: boolean;
	private _navBarMode: NavBarMode;
	sections: HTMLElement[];
	ignoreScroll = false;
	currentSectionId = '';

	@HostListener('window:scroll', ['$event'])
	windowScrolled() {
		this.handleStickyNavEvent();
		this.handleWindowScrollNavEvent();
	}

	@HostListener('window:resize', ['$event'])
	onResize() {
		this.handleWindowScrollNavEvent();
	}

	constructor(private el: ElementRef, private router: Router, private communicationService: CommunicationService) {
		super();
	}

	ngAfterViewInit() {
		this.sections = this.el.nativeElement.getElementsByClassName('route-section');
		this.communicationService
			.getMessage(MessageType.SCROLL_TO_SECTION)
			.pipe(
				takeUntil(this.destroy$),
				switchMap(section => {
					if (this.router.url !== '/') {
						this.communicationService.sendMessage({type: MessageType.HIGHLIGHT_SCROLL_SECTION, data: section});
						return combineLatest([from(this.router.navigate([''])), of(section)]).pipe(delay(300));
					} else {
						return combineLatest([of(null), of(section)]);
					}
				}),
				concatMap(([_, sectionId]) => {
					if (sectionId) {
						let elemTop;
						for (const section of this.sections) {
							if (section.id === sectionId) {
								elemTop = section.offsetTop - 70;
								break;
							}
						}
						return of(elemTop);
					} else {
						return of(null);
					}
				}),
				switchMap(targetYPos =>
					interval(5).pipe(
						scan((acc, curr) => (targetYPos > window.pageYOffset ? acc + 10 : acc - 10), window.pageYOffset),
						takeWhile(val => (targetYPos > window.pageYOffset ? val < targetYPos : val > targetYPos))
					)
				)
			)
			.subscribe(position => {
				if (position) {
					window.scrollTo(0, position);
				}
			});
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this.stickySet.emit(false);
	}

	handleStickyNavEvent(): void {
		if (this.navBarMode === NavBarMode.FREE) {
			const wrapper = this.el.nativeElement;
			const docViewTop = window.pageYOffset;
			if (docViewTop > wrapper.offsetTop + this.stickyOffset) {
				if (!this.isStickied) {
					this.isStickied = true;
				}
			} else {
				if (this.isStickied) {
					this.isStickied = false;
				}
			}
		}
	}

	handleWindowScrollNavEvent(): void {
		const docViewTop = window.pageYOffset;
		if (!this.ignoreScroll) {
			let currentSectionId: string;
			for (const section of this.sections as any) {
				const elemTop = section.offsetTop - 90;
				const isAtTop = docViewTop >= elemTop;
				const rect = section.getBoundingClientRect();
				const isVisible =
					rect.bottom >= 0 &&
					rect.left >= 0 &&
					rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
					rect.top <= (window.innerHeight || document.documentElement.clientHeight);
				if (isAtTop && isVisible && rect.top > 0) {
					currentSectionId = section.id;
					break;
				}
			}
			if (currentSectionId) {
				if (currentSectionId !== this.currentSectionId) {
					this.currentSectionId = currentSectionId;
					this.communicationService.sendMessage({
						type: MessageType.HIGHLIGHT_SCROLL_SECTION,
						data: currentSectionId
					});
				}
			}
		}
	}
}