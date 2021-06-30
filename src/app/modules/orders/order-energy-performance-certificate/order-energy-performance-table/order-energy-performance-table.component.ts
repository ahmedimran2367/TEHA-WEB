import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { OrderEnergyPerformanceTableDataSource, OrderEnergyPerformanceTableItem } from './order-energy-performance-table-datasource';

@Component({
  selector: 'app-order-energy-performance-table',
  templateUrl: './order-energy-performance-table.component.html',
  styleUrls: ['./order-energy-performance-table.component.scss']
})
export class OrderEnergyPerformanceTableComponent implements AfterViewInit, OnInit {

  @ViewChild(MatTable) table: MatTable<OrderEnergyPerformanceTableItem>;
  dataSource: OrderEnergyPerformanceTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'tehaUserno',
    'adminUserno',
    'street',
    'postCode',
    'city',
    'status',
    'issuanceDate',
    'exhibitionDate',
    'download',
    'actions'
  ];

  ngOnInit(): void {
    this.dataSource = new OrderEnergyPerformanceTableDataSource();
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }
}
