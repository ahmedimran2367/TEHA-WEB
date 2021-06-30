import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFlatOverviewComponent } from './dashboard-flat-overview.component';

describe('DashboardFlatOverviewComponent', () => {
  let component: DashboardFlatOverviewComponent;
  let fixture: ComponentFixture<DashboardFlatOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFlatOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFlatOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
