import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {Post} from '../../../../shared/models/post';
import {BehaviorSubject, merge, of} from 'rxjs';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {concatMap, filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {NotificationService} from '../../../../shared/services/notification.service';
import {CompressorService} from '../../../services/compressor.service';

@Component({
	selector: 'app-post-details',
	templateUrl: './post-details.component.html',
	styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent extends BaseObserverComponent implements OnInit {
	post: BehaviorSubject<Post> = new BehaviorSubject(undefined);
	postForm: FormGroup;

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private notificationService: NotificationService,
		private compressor: CompressorService
	) {
		super();
		const navigation = this.router.getCurrentNavigation();
		if (navigation.extras.state as Post) {
			this.post.next(navigation.extras.state as Post);
		}
	}

	ngOnInit() {
		this.initForm();
	}

	private initForm() {
		this.postForm = this.fb.group({
			title: ['', [Validators.required]],
			description: ['', [Validators.required]],
			role: ['', []],
			timeline: ['', []],
			mediumLink: ['', []],
			prototypeLink: ['', []],
			headerImg: ['', []],
			thumbImg: ['', []]
		});
		merge(
			this.postForm.get('thumbImg').valueChanges.pipe(
				map(value => {
					return {source: 'thumbImg', value};
				})
			),
			this.postForm.get('headerImg').valueChanges.pipe(
				map(value => {
					return {source: 'headerImg', value};
				})
			)
		)
			.pipe(takeUntil(this.destroy$))
			.subscribe(result => {
				if (this.postForm.get(result.source).hasError('invalid')) {
					this.notificationService.showError({
						message: 'Unsupported file type. Select only image files',
						duration: 5000,
						enableClose: true
					});
					this.postForm.get(result.source).setValue(null, {emitEvent: false});
				}
			});

		this.postForm
			.get('headerImg')
			.valueChanges.pipe(
				filter(file => !!file),
				switchMap(file => {
					if (this.postForm.get('headerImg').valid && !this.postForm.get('thumbImg').value) {
						return this.compressor
							.compress(file)
							.pipe(tap(compressedFile => this.postForm.get('thumbImg').setValue(compressedFile, {emitEvent: false})));
					} else {
						return of(file);
					}
				}),
				takeUntil(this.destroy$)
			)
			.subscribe(() => {}, err => console.log('error compressing file: ', err));
	}

	clearValue(control: AbstractControl) {
		control.patchValue('');
	}
}
