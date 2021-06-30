import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSmokeDetectorPropertyTableComponent } from './order-smoke-detector-property-table.component';

describe('OrderSmokeDetectorPropertyTableComponent', () => {
  let component: OrderSmokeDetectorPropertyTableComponent;
  let fixture: ComponentFixture<OrderSmokeDetectorPropertyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSmokeDetectorPropertyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSmokeDetectorPropertyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
