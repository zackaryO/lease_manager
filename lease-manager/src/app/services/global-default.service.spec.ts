import { TestBed } from '@angular/core/testing';

import { GlobalDefaultService } from './global-default.service';

describe('GlobalDefaultService', () => {
  let service: GlobalDefaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalDefaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
