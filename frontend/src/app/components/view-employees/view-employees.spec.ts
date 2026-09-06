import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployees } from './view-employees';

describe('ViewEmployees', () => {
  let component: ViewEmployees;
  let fixture: ComponentFixture<ViewEmployees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmployees],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEmployees);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
