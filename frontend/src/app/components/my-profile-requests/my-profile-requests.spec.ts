import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileRequests } from './my-profile-requests';

describe('MyProfileRequests', () => {
  let component: MyProfileRequests;
  let fixture: ComponentFixture<MyProfileRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
