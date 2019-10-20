import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BaseObserverComponent} from '../../../../shared/components/base-observer/base-observer.component';
import {Post} from '../../../../shared/models/post';
import {BehaviorSubject} from 'rxjs';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'app-post-details',
	templateUrl: './post-details.component.html',
	styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent extends BaseObserverComponent implements OnInit {
	post: BehaviorSubject<Post> = new BehaviorSubject(undefined);
	postForm: FormGroup;

	constructor(private router: Router, private fb: FormBuilder) {
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
			prototypeLink: ['', []]
		});
	}

	clearValue(control: AbstractControl) {
		control.patchValue('');
	}
}
