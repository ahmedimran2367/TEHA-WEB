import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRequestFormComponent } from './offer-request-form.component';

describe('OfferRequestFormComponent', () => {
  let component: OfferRequestFormComponent;
  let fixture: ComponentFixture<OfferRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
