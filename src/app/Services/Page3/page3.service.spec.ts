import { TestBed } from '@angular/core/testing';

import { Page3Service } from './page3.service';

describe('Page3Service', () => {
  let service: Page3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Page3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
