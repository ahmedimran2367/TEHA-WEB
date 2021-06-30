import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSnackComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorSnackComponent;
  let fixture: ComponentFixture<ErrorSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
