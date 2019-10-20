import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserFileUploadComponent} from './user-file-upload.component';

describe('FileUploadComponent', () => {
	let component: UserFileUploadComponent;
	let fixture: ComponentFixture<UserFileUploadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UserFileUploadComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserFileUploadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
