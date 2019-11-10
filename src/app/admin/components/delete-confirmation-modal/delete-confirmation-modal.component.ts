import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MODAL_DATA} from '../../../shared/services/modal.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-delete-confirmation-modal',
	templateUrl: './delete-confirmation-modal.component.html',
	styleUrls: ['./delete-confirmation-modal.component.scss']
})
export class DeleteConfirmationModalComponent implements OnInit {
	infoText = 'This item will be permanently removed.';
	constructor(@Optional() @Inject(MODAL_DATA) private modalData: any, public activeModal: NgbActiveModal) {
		console.log('Function: constructor, modalData: ', modalData);
		if (modalData && modalData.data) {
			this.infoText = modalData.data.itemName + ' will be removed from the media library.';
		}
	}

	ngOnInit() {}

	closeModal(event: MouseEvent) {
		if (event) {
			event.preventDefault();
		}
		this.activeModal.dismiss(null);
	}

	handleDelete() {
		this.activeModal.close(true);
	}
}
