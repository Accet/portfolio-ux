import {Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output} from '@angular/core';

@Directive({
	selector: '[appHoverDetector]'
})
export class HoverDetectorDirective implements OnDestroy {
	@Output() hovered = new EventEmitter<boolean>();

	constructor(private el: ElementRef) {}

	@HostListener('dragover', ['$event'])
	onDragOver(event) {
		event.preventDefault();
		event.stopPropagation();
		this.hovered.emit(true);
	}

	@HostListener('dragleave', ['$event'])
	onDragLeave(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		const rect = this.el.nativeElement.getBoundingClientRect();
		if (evt.clientY < rect.top || evt.clientY >= rect.bottom || evt.clientX < rect.left || evt.clientX >= rect.right) {
			this.hovered.emit(false);
		}
	}

	@HostListener('drop', ['$event'])
	onDrop(event) {
		event.preventDefault();
		this.hovered.emit(false);
	}

	ngOnDestroy(): void {
		console.log('Function: ngOnDestroy, : ');
	}
}
