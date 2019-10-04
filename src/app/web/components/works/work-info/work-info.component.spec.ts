import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WorkInfoComponent} from './work-info.component';

describe('WorkInfoComponent', () => {
	let component: WorkInfoComponent;
	let fixture: ComponentFixture<WorkInfoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WorkInfoComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WorkInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
