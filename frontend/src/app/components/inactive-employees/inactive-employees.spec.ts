import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveEmployees } from './inactive-employees';

describe('InactiveEmployees', () => {
  let component: InactiveEmployees;
  let fixture: ComponentFixture<InactiveEmployees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactiveEmployees],
    }).compileComponents();

    fixture = TestBed.createComponent(InactiveEmployees);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
