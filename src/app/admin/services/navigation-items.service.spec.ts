import {TestBed} from '@angular/core/testing';

import {NavigationItemsService} from './navigation-items.service';

describe('NavigationItemsService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: NavigationItemsService = TestBed.get(NavigationItemsService);
		expect(service).toBeTruthy();
	});
});
