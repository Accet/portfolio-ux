import {Injectable, InjectionToken, Injector} from '@angular/core';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject, from, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

export const MODAL_DATA = new InjectionToken('modalData');

@Injectable()
export class ModalService {
	modalOpened$: BehaviorSubject<NgbModalRef> = new BehaviorSubject(null);
	modalRef: NgbModalRef;
	displayedModals: any[] = [];

	defaultConfig: NgbModalOptions = {
		centered: true,
		windowClass: 'g-modal',
		backdrop: 'static'
	};

	constructor(private injector: Injector, private ngbModalService: NgbModal) {}

	open(modalContent: any, modalData?: any, modalConfig?: NgbModalOptions): NgbModalRef {
		// this.dismissAll();
		this.modalRef = this.ngbModalService.open(modalContent, this.configureModal(modalData, modalConfig));
		this.modalOpened$.next(this.modalRef);
		from(this.modalRef.result)
			.pipe(
				catchError(() => of(null)),
				finalize(() => this.removeFromDisplayedModals())
			)
			.subscribe();
		this.displayedModals.push(this.modalRef);
		return this.modalRef;
	}

	dismissAll(reason?: any): void {
		this.ngbModalService.dismissAll(reason);
	}

	private configureModal(modalData?: any, modalConfig?: NgbModalOptions): any {
		if (modalConfig && modalConfig.windowClass) {
			modalConfig.windowClass = `${this.defaultConfig.windowClass} ${modalConfig.windowClass}`;
		}

		return Object.assign({}, this.defaultConfig, modalConfig, {
			injector: Injector.create({providers: [{provide: MODAL_DATA, useValue: {data: modalData}}]})
		});
	}

	private removeFromDisplayedModals() {
		this.displayedModals.pop();
		if (!this.displayedModals.length) {
			this.modalOpened$.next(null);
		}
	}
}
