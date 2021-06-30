import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockoverviewComponent } from './stockoverview.component';

describe('StockoverviewComponent', () => {
  let component: StockoverviewComponent;
  let fixture: ComponentFixture<StockoverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockoverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
