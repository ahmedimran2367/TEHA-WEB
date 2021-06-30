import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonOverviewCardComponent } from './person-overview-card.component';

describe('PersonOverviewCardComponent', () => {
  let component: PersonOverviewCardComponent;
  let fixture: ComponentFixture<PersonOverviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonOverviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
