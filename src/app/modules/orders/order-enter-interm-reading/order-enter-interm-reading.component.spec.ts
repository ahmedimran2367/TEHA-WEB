import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEnterIntermReadingComponent } from './order-enter-interm-reading.component';

describe('OrderEnterIntermReadingComponent', () => {
  let component: OrderEnterIntermReadingComponent;
  let fixture: ComponentFixture<OrderEnterIntermReadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEnterIntermReadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEnterIntermReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
