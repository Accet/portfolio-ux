import {TestBed} from '@angular/core/testing';

import {UserDataManagerService} from './user-data-manager.service';

describe('UserDataManagerService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: UserDataManagerService = TestBed.get(UserDataManagerService);
		expect(service).toBeTruthy();
	});
});
