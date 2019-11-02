import {AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {MediumEditorDirective} from '../../../directives/medium-editor.directive';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {map} from 'rxjs/operators';
import MediumButton from 'medium-button';
import MediumEditorTable from './tables-js/js/medium-editor-tables';
// import MediumEditor from 'medium-editor';
// declare var MediumEditor: any;

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {
	textVar = '';
	value$: Observable<SafeHtml>;
	@ViewChild(MediumEditorDirective, {static: true}) editor: MediumEditorDirective;
	options: any;

	constructor(protected sanitizer: DomSanitizer) {}

	ngOnInit() {
		this.options = {
			buttonLabels: 'fontawesome',
			autoLink: true,
			targetBlank: true,
			// imageDragging: false,
			toolbar: {
				/* These are the default options for the toolbar,
					 if nothing is passed this is what is used */
				allowMultiParagraphSelection: true,
				buttons: [
					'bold',
					'italic',
					'underline',
					'anchor',
					'h2',
					'h3',
					'justifyLeft',
					'justifyRight',
					'justifyFull',
					'justifyCenter',
					'orderedlist',
					'unorderedlist',
					'removeFormat',
					'insertImage',
					'table'
				],
				diffLeft: 0,
				diffTop: -10,
				firstButtonClass: 'medium-editor-button-first',
				lastButtonClass: 'medium-editor-button-last',
				relativeContainer: this.editor.element,
				standardizeSelectionStart: false,
				static: true,
				/* options which only apply when static is true */
				align: 'center',
				sticky: true,
				updateOnEmptySelection: true
			},
			paste: {
				/* This example includes the default options for paste,
					 if nothing is passed this is what it used */
				forcePlainText: false,
				cleanPastedHTML: true,
				cleanReplacements: [],
				cleanAttrs: ['class', 'style', 'dir'],
				cleanTags: ['label', 'meta'],
				unwrapTags: ['sub', 'sup']
			},
			anchor: {
				targetCheckbox: true,
				targetCheckboxText: 'Open in new window'
			},
			extensions: {
				insertImage: new MediumButton({
					label: '<i class="fas fa-image"></i>',
					action: (html, mark, parent) => {
						console.log('Function: action, html: ', html);
						console.log('Function: action, mark: ', mark);
						console.log('Function: action, parent: ', parent);
						return html;
					}
				}),
				table: new MediumEditorTable()
			}
		};
	}

	ngAfterViewInit(): void {
		this.value$ = this.editor.onUpdate.asObservable().pipe(map(html => this.sanitizer.bypassSecurityTrustHtml(html)));
	}

	updateModel(event: string) {
		console.log('Function: ngOnChanges, changes.textVar.currentValue: ', event);
	}

	private handleCustomClick(event: any) {
		console.log('Function: handleCustomClick, event: ', event);
	}
}
