import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
	selector: '[appCapsDetector]'
})
export class CapsDetectorDirective {
	constructor() {}
	@Output() state = new EventEmitter<boolean>();

	@HostListener('window:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent): void {
		this.onKeyAction(event);
	}

	@HostListener('window:keyup', ['$event'])
	onKeyUp(event: KeyboardEvent): void {
		this.onKeyAction(event);
	}

	onKeyAction(event: KeyboardEvent): void {
		const capsOn = event.getModifierState && event.getModifierState('CapsLock');
		this.state.emit(capsOn);
	}
}
