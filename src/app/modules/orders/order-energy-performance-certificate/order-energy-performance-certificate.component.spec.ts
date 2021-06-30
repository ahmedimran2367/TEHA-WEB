import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEnergyPerformanceCertificateComponent } from './order-energy-performance-certificate.component';

describe('OrderEnergyPerformanceCertificateComponent', () => {
  let component: OrderEnergyPerformanceCertificateComponent;
  let fixture: ComponentFixture<OrderEnergyPerformanceCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEnergyPerformanceCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEnergyPerformanceCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
