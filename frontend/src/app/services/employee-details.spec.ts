import { TestBed } from '@angular/core/testing';

import { EmployeeDetails } from './employee-details';

describe('EmployeeDetails', () => {
  let service: EmployeeDetails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeDetails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
