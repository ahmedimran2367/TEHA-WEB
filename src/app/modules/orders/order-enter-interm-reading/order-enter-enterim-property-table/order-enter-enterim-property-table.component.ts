import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PropertyTableItem } from 'src/app/modules/stock-overview/dashboard/property-table/property-table-datasource';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';

@Component({
  selector: 'app-order-enter-enterim-property-table',
  templateUrl: './order-enter-enterim-property-table.component.html',
  styleUrls: ['./order-enter-enterim-property-table.component.scss']
})
export class OrderEnterEnterimPropertyTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  propertyDataSource: MatTableDataSource<PropertyTableItem>;
  pageSize = 10;
  displayedPropertyColumns = [
    'tehalgno',
    'adminlgno',
    'street',
    'postcode',
    'place',
    'actions',
  ];
  data: any;
  @Output()
  enterPropertyEvent = new EventEmitter();
  constructor(
    private browserService: BrowserStorageService,
    public defaultDataService: DefaultDataService ) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.loadData();
  }
  loadData(): void {
    this.propertyDataSource = new MatTableDataSource(this.browserService.getSessionStorage('userProperties'));
    this.propertyDataSource.sort = this.sort;
    this.propertyDataSource.paginator = this.paginator;
  }
  createOrder(id): void {
    this.data = true;
    this.browserService.setlocalStorage('currentPropertyId', id);
    this.enterPropertyEvent.emit(this.data);
  }
  applyFilter(filterValue: string): void {
    this.propertyDataSource.filter = filterValue.trim().toLowerCase();
  }

}
