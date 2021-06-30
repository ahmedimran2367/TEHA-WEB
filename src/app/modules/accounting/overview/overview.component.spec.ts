import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAccountingOverviewComponent } from './dashboard-accounting-overview.component';

describe('DashboardAccountingOverviewComponent', () => {
  let component: DashboardAccountingOverviewComponent;
  let fixture: ComponentFixture<DashboardAccountingOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAccountingOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAccountingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
