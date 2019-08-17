import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SCareComponent} from './s-care.component';

describe('SCareComponent', () => {
	let component: SCareComponent;
	let fixture: ComponentFixture<SCareComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SCareComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SCareComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
