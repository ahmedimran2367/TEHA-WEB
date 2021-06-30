import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReadingPropertyTableComponent } from './order-reading-property-table.component';

describe('OrderReadingPropertyTableComponent', () => {
  let component: OrderReadingPropertyTableComponent;
  let fixture: ComponentFixture<OrderReadingPropertyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderReadingPropertyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReadingPropertyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
