import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OderWaterAnalysisNewBuildingComponent } from './oder-water-analysis-new-building.component';

describe('OderWaterAnalysisNewBuildingComponent', () => {
  let component: OderWaterAnalysisNewBuildingComponent;
  let fixture: ComponentFixture<OderWaterAnalysisNewBuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OderWaterAnalysisNewBuildingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OderWaterAnalysisNewBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
