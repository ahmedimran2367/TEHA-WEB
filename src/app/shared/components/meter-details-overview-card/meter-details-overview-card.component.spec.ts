import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterDetailsOverviewCardComponent } from './meter-details-overview-card.component';

describe('MeterDetailsOverviewCardComponent', () => {
  let component: MeterDetailsOverviewCardComponent;
  let fixture: ComponentFixture<MeterDetailsOverviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterDetailsOverviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterDetailsOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
