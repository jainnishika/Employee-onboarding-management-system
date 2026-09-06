import { TestBed } from '@angular/core/testing';

import { EditEmployee } from './edit-employee';

describe('EditEmployee', () => {
  let service: EditEmployee;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditEmployee);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
