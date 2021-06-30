import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingInfoCardComponent } from './building-info-card.component';

describe('BuildingInfoCardComponent', () => {
  let component: BuildingInfoCardComponent;
  let fixture: ComponentFixture<BuildingInfoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingInfoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
