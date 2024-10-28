import { TestBed } from '@angular/core/testing';

import { DevAdminService } from './dev-admin.service';

describe('DevAdminService', () => {
  let service: DevAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
