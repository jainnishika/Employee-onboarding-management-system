import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManual } from './user-manual';

describe('UserManual', () => {
  let component: UserManual;
  let fixture: ComponentFixture<UserManual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManual],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManual);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
