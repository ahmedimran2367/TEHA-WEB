import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEnterEnterimPropertyTableComponent } from './order-enter-enterim-property-table.component';

describe('OrderEnterEnterimPropertyTableComponent', () => {
  let component: OrderEnterEnterimPropertyTableComponent;
  let fixture: ComponentFixture<OrderEnterEnterimPropertyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEnterEnterimPropertyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEnterEnterimPropertyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
