import { TestBed } from '@angular/core/testing';

import { Page4Service } from './page4.service';

describe('Page4Service', () => {
  let service: Page4Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Page4Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
