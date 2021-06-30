import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSmokeDetectorTestComponent } from './order-smoke-detector-test.component';

describe('OrderSmokeDetectorTestComponent', () => {
  let component: OrderSmokeDetectorTestComponent;
  let fixture: ComponentFixture<OrderSmokeDetectorTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSmokeDetectorTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSmokeDetectorTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
