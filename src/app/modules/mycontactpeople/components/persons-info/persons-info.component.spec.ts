import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonsInfoComponent } from './persons-info.component';

describe('PersonsInfoComponent', () => {
  let component: PersonsInfoComponent;
  let fixture: ComponentFixture<PersonsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
