import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReadingComponent } from './order-reading.component';

describe('OrderReadingComponent', () => {
  let component: OrderReadingComponent;
  let fixture: ComponentFixture<OrderReadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderReadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
