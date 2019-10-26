import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'app-removable-image',
	templateUrl: './removable-image.component.html',
	styleUrls: ['./removable-image.component.scss']
})
export class RemovableImageComponent implements OnInit {
	@Input() url: string;
	@Output() removeClicked: EventEmitter<void> = new EventEmitter<void>();
	constructor() {}

	ngOnInit() {}

	handleDelete() {
		this.removeClicked.emit();
	}
}
