import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWaterAnalysisComponent } from './order-water-analysis.component';

describe('OrderWaterAnalysisComponent', () => {
  let component: OrderWaterAnalysisComponent;
  let fixture: ComponentFixture<OrderWaterAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderWaterAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWaterAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
