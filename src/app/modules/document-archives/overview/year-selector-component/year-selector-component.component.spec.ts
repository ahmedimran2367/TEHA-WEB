import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearSelectorComponentComponent } from './year-selector-component.component';

describe('YearSelectorComponentComponent', () => {
  let component: YearSelectorComponentComponent;
  let fixture: ComponentFixture<YearSelectorComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearSelectorComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearSelectorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
