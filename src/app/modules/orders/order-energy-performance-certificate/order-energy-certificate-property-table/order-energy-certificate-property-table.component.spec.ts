import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEnergyCertificatePropertyTableComponent } from './order-energy-certificate-property-table.component';

describe('OrderEnergyCertificatePropertyTableComponent', () => {
  let component: OrderEnergyCertificatePropertyTableComponent;
  let fixture: ComponentFixture<OrderEnergyCertificatePropertyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEnergyCertificatePropertyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEnergyCertificatePropertyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
