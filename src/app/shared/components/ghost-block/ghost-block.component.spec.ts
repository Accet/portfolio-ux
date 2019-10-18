import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GhostBlockComponent} from './ghost-block.component';

describe('GhostBlockComponent', () => {
	let component: GhostBlockComponent;
	let fixture: ComponentFixture<GhostBlockComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GhostBlockComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GhostBlockComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
