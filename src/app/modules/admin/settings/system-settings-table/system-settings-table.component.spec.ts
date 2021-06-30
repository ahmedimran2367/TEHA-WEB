import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSettingsTableComponent } from './system-settings-table.component';

describe('SystemSettingsTableComponent', () => {
  let component: SystemSettingsTableComponent;
  let fixture: ComponentFixture<SystemSettingsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSettingsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSettingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
