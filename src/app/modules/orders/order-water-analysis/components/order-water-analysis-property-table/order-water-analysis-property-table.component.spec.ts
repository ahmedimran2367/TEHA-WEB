import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWaterAnalysisPropertyTableComponent } from './order-water-analysis-property-table.component';

describe('OrderWaterAnalysisPropertyTableComponent', () => {
  let component: OrderWaterAnalysisPropertyTableComponent;
  let fixture: ComponentFixture<OrderWaterAnalysisPropertyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderWaterAnalysisPropertyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWaterAnalysisPropertyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
