import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInterimPropertyTableComponent } from './order-interim-property-table.component';

describe('OrderInterimPropertyTableComponent', () => {
  let component: OrderInterimPropertyTableComponent;
  let fixture: ComponentFixture<OrderInterimPropertyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderInterimPropertyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderInterimPropertyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
