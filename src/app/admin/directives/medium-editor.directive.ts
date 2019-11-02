import {
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges
} from '@angular/core';
import * as MediumEditor from 'medium-editor';

@Directive({
	selector: '[appMediumEditor]'
})
export class MediumEditorDirective implements OnInit, OnDestroy {
	element: any;
	editor: any;
	// tslint:disable-next-line:no-output-on-prefix
	@Output() onUpdate: EventEmitter<string> = new EventEmitter<string>();

	@Input() options: any;
	@Input() model: string;
	@Input() placeholder: string;

	constructor(private el: ElementRef) {}

	ngOnInit() {
		this.element = this.el.nativeElement;
		this.element.innerHTML = '<div class="me-editable">' + this.model + '</div>';
		if (this.placeholder && this.placeholder.length) {
			this.options.placeholder = {
				text: this.placeholder
			};
		}
		// Global MediumEditor
		this.editor = new MediumEditor('.me-editable', this.options);
		this.editor.subscribe('editableInput', (event, editable) => {
			this.model = this.editor.getContent();
			this.onUpdate.emit(this.model);
		});
	}

	ngOnDestroy(): void {
		if (this.editor) {
			this.editor.unsubscribe('editableInput');
			this.editor.destroy();
		}
	}
}
