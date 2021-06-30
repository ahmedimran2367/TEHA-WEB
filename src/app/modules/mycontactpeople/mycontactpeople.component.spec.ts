import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycontactpeopleComponent } from './mycontactpeople.component';

describe('MycontactpeopleComponent', () => {
  let component: MycontactpeopleComponent;
  let fixture: ComponentFixture<MycontactpeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycontactpeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycontactpeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
