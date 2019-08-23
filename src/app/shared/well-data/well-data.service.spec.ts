import { TestBed } from '@angular/core/testing';

import { WellDataService } from './well-data.service';

describe('WellDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WellDataService = TestBed.get(WellDataService);
    expect(service).toBeTruthy();
  });
});
