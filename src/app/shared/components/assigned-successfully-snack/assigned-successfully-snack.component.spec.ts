import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedSuccessfullySnackComponent } from './assigned-successfully-snack.component';

describe('AssignedSuccessfullySnackComponent', () => {
  let component: AssignedSuccessfullySnackComponent;
  let fixture: ComponentFixture<AssignedSuccessfullySnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedSuccessfullySnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedSuccessfullySnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
