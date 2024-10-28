import { TestBed } from '@angular/core/testing';

import { Page5Service } from './page5.service';

describe('Page5Service', () => {
  let service: Page5Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Page5Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
