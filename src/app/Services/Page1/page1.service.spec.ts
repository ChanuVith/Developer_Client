import { TestBed } from '@angular/core/testing';

import { Page1Service } from './page1.service';

describe('Page1Service', () => {
  let service: Page1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Page1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
