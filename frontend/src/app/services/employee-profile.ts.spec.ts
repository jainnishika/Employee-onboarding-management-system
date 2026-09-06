import { TestBed } from '@angular/core/testing';

import { EmployeeProfileTs } from './employee-profile.ts';

describe('EmployeeProfileTs', () => {
  let service: EmployeeProfileTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeProfileTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
