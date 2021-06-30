import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostDataComponent } from './cost-data.component';

describe('CostDataComponent', () => {
  let component: CostDataComponent;
  let fixture: ComponentFixture<CostDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
