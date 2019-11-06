import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MediaLibraryContainerComponent} from './media-library-container.component';

describe('MediaLibraryContainerComponent', () => {
	let component: MediaLibraryContainerComponent;
	let fixture: ComponentFixture<MediaLibraryContainerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MediaLibraryContainerComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MediaLibraryContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
