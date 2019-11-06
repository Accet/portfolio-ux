import {Component, Inject, Input, OnInit, Optional, ViewChild} from '@angular/core';
import {MODAL_DATA} from '../../../../shared/services/modal.service';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MatButton} from '@angular/material';
import {User} from '../../../../shared/models/user';

@Component({
	selector: 'app-media-library-modal',
	templateUrl: './media-library-modal.component.html',
	styleUrls: ['./media-library-modal.component.scss']
})
export class MediaLibraryModalComponent extends BaseObserverComponent implements OnInit {
	@ViewChild('btnRef', {static: true}) buttonRef: MatButton;

	currentUser: User;

	constructor(@Optional() @Inject(MODAL_DATA) private modalData: any, public activeModal: NgbActiveModal) {
		super();
		// if (modalData && modalData.user) {
		// 	this.currentUser = modalData.user;
		// }
	}

	ngOnInit() {
		this.buttonRef.focus();
	}

	closeModal(event: MouseEvent) {
		if (event) {
			event.preventDefault();
		}
		this.activeModal.dismiss(null);
	}

	handleSelect($event: MouseEvent) {}
}
