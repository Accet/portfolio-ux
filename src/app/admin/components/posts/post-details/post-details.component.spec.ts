import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PostComponent} from './new-post.component';

describe('NewPostComponent', () => {
	let component: PostComponent;
	let fixture: ComponentFixture<PostComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PostComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
