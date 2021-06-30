import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ConsumptionOfThermalEnergyTableDataSource, ConsumptionOfThermalEnergyTableItem } from './consumption-of-thermal-energy-table-datasource';

@Component({
  selector: 'app-consumption-of-thermal-energy-table',
  templateUrl: './consumption-of-thermal-energy-table.component.html',
  styleUrls: ['./consumption-of-thermal-energy-table.component.scss']
})
export class ConsumptionOfThermalEnergyTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable) table: MatTable<ConsumptionOfThermalEnergyTableItem>;
  dataSource: ConsumptionOfThermalEnergyTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit(): void {
    this.dataSource = new ConsumptionOfThermalEnergyTableDataSource();
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }
}
