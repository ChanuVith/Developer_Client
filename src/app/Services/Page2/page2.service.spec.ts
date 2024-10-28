import { TestBed } from '@angular/core/testing';

import { Page2Service } from './page2.service';

describe('Page2Service', () => {
  let service: Page2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Page2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
