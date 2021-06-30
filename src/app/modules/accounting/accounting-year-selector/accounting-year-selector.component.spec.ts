import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingYearSelectorComponent } from './accounting-year-selector.component';

describe('AccountingYearSelectorComponent', () => {
  let component: AccountingYearSelectorComponent;
  let fixture: ComponentFixture<AccountingYearSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingYearSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingYearSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
