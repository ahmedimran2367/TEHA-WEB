import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { AmountOfHotWaterUsedTableDataSource, AmountOfHotWaterUsedTableItem } from './amount-of-hot-water-used-table-datasource';

@Component({
  selector: 'app-amount-of-hot-water-used-table',
  templateUrl: './amount-of-hot-water-used-table.component.html',
  styleUrls: ['./amount-of-hot-water-used-table.component.scss']
})
export class AmountOfHotWaterUsedTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable) table: MatTable<AmountOfHotWaterUsedTableItem>;
  dataSource: AmountOfHotWaterUsedTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit(): void {
    this.dataSource = new AmountOfHotWaterUsedTableDataSource();
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }
}
