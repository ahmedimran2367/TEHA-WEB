import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRequestFormSummaryComponent } from './offer-request-form-summary.component';

describe('OfferRequestFormSummaryComponent', () => {
  let component: OfferRequestFormSummaryComponent;
  let fixture: ComponentFixture<OfferRequestFormSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferRequestFormSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferRequestFormSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
