import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, merge, Observable, Subject} from 'rxjs';
import {DropZoneDirective} from '../../directives/drop-zone.directive';
import {debounceTime, distinctUntilChanged, map, shareReplay, switchMap, takeUntil, tap} from 'rxjs/operators';
import {BaseObserverComponent} from '../../../shared/components/base-observer/base-observer.component';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';

export interface ImageDataItem {
	file?: File;
	url?: string;
}

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

	setValue$: Subject<ImageDataItem> = new Subject<ImageDataItem>();

	@ViewChild(DropZoneDirective, {static: false}) set dropFile(element: DropZoneDirective) {
		this.dropFile$.next(element);
	}

	selectedFile$: Observable<ImageDataItem>;
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
			map(fileList => {
				return {file: fileList.item(0)} as ImageDataItem;
			}),
			shareReplay(1)
		);

		this.selectedFile$ = merge(this.setValue$.asObservable(), fileDrop).pipe(
			map(item => {
				if (item && item.file) {
					Object.defineProperty(item.file, 'name', {
						writable: true,
						value: item.file.name.replace(/[\s-]+/g, '_').toLocaleLowerCase()
					});
				}
				return item;
			}),
			tap(item => {
				if (item && item.file) {
					this.propagateTouched();

					const reader = new FileReader();

					reader.onload = (event: any) => {
						this.url = event.target.result;
					};
					reader.readAsDataURL(item.file);
				} else if (item && item.url) {
					this.url = item.url;
				} else {
					this.url = null;
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
		if (!value || !value.file) {
			return null;
		}
		const isNotValid = value.file.type.split('/')[0] !== 'image';
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
	private propagateChange = (_: ImageDataItem) => {};

	private propagateTouched = () => {};

	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.propagateTouched = fn;
	}

	writeValue(obj: ImageDataItem): void {
		if (obj !== undefined) {
			this.setValue$.next(obj);
		}
	}

	handleReset() {
		this.propagateTouched();
		this.setValue$.next(null);
	}
}
