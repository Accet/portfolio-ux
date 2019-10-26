import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, merge, Observable, Subject} from 'rxjs';
import {DropZoneDirective} from '../../directives/drop-zone.directive';
import {debounceTime, distinctUntilChanged, map, shareReplay, switchMap, takeUntil, tap} from 'rxjs/operators';
import {BaseObserverComponent} from '../../../shared/components/base-observer/base-observer.component';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
	selector: 'app-image-upload',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: ImageUploadComponent,
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: ImageUploadComponent,
			multi: true
		}
	],
	templateUrl: './image-upload.component.html',
	styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent extends BaseObserverComponent implements ControlValueAccessor, OnInit {
	private _percentage: Subject<number> = new Subject<number>();
	public lottieConfig: any;
	private anim: any;
	private _isHovering$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	dropFile$: Subject<DropZoneDirective> = new Subject<DropZoneDirective>();

	setValue$: Subject<File> = new Subject<File>();

	@ViewChild(DropZoneDirective, {static: false}) set dropFile(element: DropZoneDirective) {
		this.dropFile$.next(element);
	}

	selectedFile$: Observable<File>;
	url: string;

	isHovering$: Observable<boolean>;
	@Input() set percentage(percentage: number) {
		this._percentage.next(percentage);
	}

	@Input() placeholderImgSrc: string;

	constructor() {
		super();

		this.lottieConfig = {
			path: 'assets/upload.json',
			autoplay: true,
			loop: true
		};
	}

	ngOnInit() {
		const fileDrop = this.dropFile$.asObservable().pipe(
			switchMap(el => el.dropped.asObservable()),
			map(fileList => fileList.item(0)),
			shareReplay(1)
		);
		// fileDrop.subscribe(file => console.log('Function: file, : '));

		this.selectedFile$ = merge(this.setValue$.asObservable(), fileDrop).pipe(
			map(file => {
				if (file) {
					Object.defineProperty(file, 'name', {
						writable: true,
						value: file.name.replace(/[\s-]+/g, '_').toLocaleLowerCase()
					});
				}
				return file;
			}),
			tap(file => {
				if (file) {
					const reader = new FileReader();

					reader.onload = (event: any) => {
						this.url = event.target.result;
					};
					reader.readAsDataURL(file);
				}
			}),
			shareReplay(1)
		);
		this.selectedFile$.pipe(takeUntil(this.destroy$)).subscribe(file => this.propagateChange(file));

		this.isHovering$ = this._isHovering$.asObservable().pipe(
			distinctUntilChanged(),
			debounceTime(50)
		);
	}

	validate({value}: FormControl) {
		if (!value) {
			return null;
		}
		const isNotValid = value.type.split('/')[0] !== 'image';
		return (
			isNotValid && {
				invalid: true
			}
		);
	}

	handleAnimation(anim) {
		this.anim = anim;
	}

	toggleHover(event) {
		this._isHovering$.next(event);
	}
	propagateChange = (_: File) => {};

	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {}

	writeValue(obj: File): void {
		if (obj !== undefined) {
			this.setValue$.next(obj);
		}
	}

	handleReset() {
		this.setValue$.next(null);
	}
}
