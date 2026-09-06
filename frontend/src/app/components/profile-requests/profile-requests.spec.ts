import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRequests } from './profile-requests';

describe('ProfileRequests', () => {
  let component: ProfileRequests;
  let fixture: ComponentFixture<ProfileRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
