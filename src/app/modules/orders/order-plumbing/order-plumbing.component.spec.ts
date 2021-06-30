import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlumbingComponent } from './order-plumbing.component';

describe('OrderPlumbingComponent', () => {
  let component: OrderPlumbingComponent;
  let fixture: ComponentFixture<OrderPlumbingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPlumbingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPlumbingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
