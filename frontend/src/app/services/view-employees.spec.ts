import { TestBed } from '@angular/core/testing';

import { ViewEmployees } from './view-employees';

describe('ViewEmployees', () => {
  let service: ViewEmployees;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewEmployees);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
