import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderOfferRequestComponent } from './order-offer-request.component';

describe('OrderOfferRequestComponent', () => {
  let component: OrderOfferRequestComponent;
  let fixture: ComponentFixture<OrderOfferRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderOfferRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderOfferRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
