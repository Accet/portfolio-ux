import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MediaLibraryModalComponent} from './media-library-modal.component';

describe('MediaLibraryModalComponent', () => {
	let component: MediaLibraryModalComponent;
	let fixture: ComponentFixture<MediaLibraryModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MediaLibraryModalComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MediaLibraryModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
