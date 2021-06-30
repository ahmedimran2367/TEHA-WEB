import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { AmountOfHotWaterUsedTableComponent } from './amount-of-hot-water-used-table.component';

describe('AmountOfHotWaterUsedTableComponent', () => {
  let component: AmountOfHotWaterUsedTableComponent;
  let fixture: ComponentFixture<AmountOfHotWaterUsedTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountOfHotWaterUsedTableComponent ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountOfHotWaterUsedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
