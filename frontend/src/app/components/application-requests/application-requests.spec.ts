import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationRequests } from './application-requests';

describe('ApplicationRequests', () => {
  let component: ApplicationRequests;
  let fixture: ComponentFixture<ApplicationRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
