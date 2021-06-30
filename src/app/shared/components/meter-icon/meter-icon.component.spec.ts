import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterIconComponent } from './meter-icon.component';

describe('MeterIconComponent', () => {
  let component: MeterIconComponent;
  let fixture: ComponentFixture<MeterIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
