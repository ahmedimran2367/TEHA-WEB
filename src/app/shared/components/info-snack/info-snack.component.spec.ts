import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSnackComponent } from './info-snack.component';

describe('InfoSnackComponent', () => {
  let component: InfoSnackComponent;
  let fixture: ComponentFixture<InfoSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
