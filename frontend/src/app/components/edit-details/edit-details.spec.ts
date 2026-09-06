import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDetails } from './edit-details';

describe('EditDetails', () => {
  let component: EditDetails;
  let fixture: ComponentFixture<EditDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(EditDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
