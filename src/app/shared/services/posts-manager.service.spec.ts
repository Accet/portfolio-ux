import {TestBed} from '@angular/core/testing';

import {PostsManagerService} from './posts-manager.service';

describe('PostsManagerService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: PostsManagerService = TestBed.get(PostsManagerService);
		expect(service).toBeTruthy();
	});
});
