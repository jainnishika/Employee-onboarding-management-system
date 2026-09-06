import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyApplication } from './apply-application';

describe('ApplyApplication', () => {
  let component: ApplyApplication;
  let fixture: ComponentFixture<ApplyApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyApplication],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyApplication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
