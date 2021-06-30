import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OderWaterAnalysisSummaryComponent } from './oder-water-analysis-summary.component';

describe('OderWaterAnalysisSummaryComponent', () => {
  let component: OderWaterAnalysisSummaryComponent;
  let fixture: ComponentFixture<OderWaterAnalysisSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OderWaterAnalysisSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OderWaterAnalysisSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
