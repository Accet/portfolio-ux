import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {ModalService} from '../services/modal.service';
import {BaseObserverComponent} from '../components/base-observer/base-observer.component';

@Directive({
	selector: '[appBlurredModal]'
})
export class BlurredModalDirective extends BaseObserverComponent implements OnInit {
	constructor(private modalService: ModalService, private renderer: Renderer2, private host: ElementRef) {
		super();
	}

	ngOnInit() {
		this.modalService.modalOpened$.pipe(takeUntil(this.destroy$)).subscribe(modalRef => this.toggleBlur(!!modalRef));
	}

	toggleBlur(enable: boolean) {
		this.renderer[enable ? 'addClass' : 'removeClass'](this.host.nativeElement, 'modal-bg-blur');
	}
}
