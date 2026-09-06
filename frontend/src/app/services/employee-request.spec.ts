import { TestBed } from '@angular/core/testing';

import { EmployeeRequest } from './employee-request';

describe('EmployeeRequest', () => {
  let service: EmployeeRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
