import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlumbingFOrmComponent } from './order-plumbing-form.component';

describe('OrderPlumbingFOrmComponent', () => {
  let component: OrderPlumbingFOrmComponent;
  let fixture: ComponentFixture<OrderPlumbingFOrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPlumbingFOrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPlumbingFOrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
