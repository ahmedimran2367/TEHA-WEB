import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInterimReadingComponent } from './order-interim-reading.component';

describe('OrderInterimReadingComponent', () => {
  let component: OrderInterimReadingComponent;
  let fixture: ComponentFixture<OrderInterimReadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderInterimReadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderInterimReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
