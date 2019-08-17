import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BinquitComponent} from './binquit.component';

describe('BinquitComponent', () => {
	let component: BinquitComponent;
	let fixture: ComponentFixture<BinquitComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BinquitComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BinquitComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
