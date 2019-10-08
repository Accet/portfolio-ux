import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReserPasswordModalComponent} from './reser-password-modal.component';

describe('ResetPasswordModalComponent', () => {
	let component: ReserPasswordModalComponent;
	let fixture: ComponentFixture<ReserPasswordModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ReserPasswordModalComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ReserPasswordModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
