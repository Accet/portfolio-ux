import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ForgotPasswordModalComponent} from './forgot-password-modal.component';

describe('ForgotPasswordComponent', () => {
	let component: ForgotPasswordModalComponent;
	let fixture: ComponentFixture<ForgotPasswordModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ForgotPasswordModalComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ForgotPasswordModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
