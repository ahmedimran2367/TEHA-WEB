import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlumbingPropertyTableComponent } from './order-plumbing-property-table.component';

describe('OrderPlumbingPropertyTableComponent', () => {
  let component: OrderPlumbingPropertyTableComponent;
  let fixture: ComponentFixture<OrderPlumbingPropertyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPlumbingPropertyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPlumbingPropertyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
