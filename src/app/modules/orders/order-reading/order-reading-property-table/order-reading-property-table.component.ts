import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PropertyTableItem } from 'src/app/modules/stock-overview/dashboard/property-table/property-table-datasource';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';

@Component({
  selector: 'app-order-reading-property-table',
  templateUrl: './order-reading-property-table.component.html',
  styleUrls: ['./order-reading-property-table.component.scss']
})
export class OrderReadingPropertyTableComponent implements OnInit, AfterViewInit {
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
  @Output()
  propertyEvent = new EventEmitter();
  readingLevel: string;
  createOrder = false;
  continueToFlats = false;
  public data = { id: null, type: null };
  constructor(
    private browserService: BrowserStorageService,
    public defaultDataService: DefaultDataService) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }

  ngOnInit(): void {
    this.readingLevel = this.browserService.getlocalStorage('readingLevel');
    if (this.readingLevel === 'Property' || this.readingLevel === 'floatingOrMyordrsProperty') {
      this.createOrder = true;
      this.continueToFlats = false;
    }
    else {
      this.createOrder = false;
      this.continueToFlats = true;
    }
  }
  ngAfterViewInit(): void {
    this.propertyDataSource = new MatTableDataSource(this.browserService.getSessionStorage('userProperties'));
    this.propertyDataSource.sort = this.sort;
    this.propertyDataSource.paginator = this.paginator;
  }
  handleCase(id): void {
    this.data.type = false;
    this.data.id = id;
    this.browserService.setlocalStorage('currentPropertyId', id);
    this.propertyEvent.emit(this.data);
  }
  createOrderPropertyLevel(id): void {
    this.browserService.setlocalStorage('currentPropertyId', id);
    this.data.type = true;
    this.data.id = id;
    this.propertyEvent.emit(this.data);
  }
  applyFilter(filterValue: string): void {
    this.propertyDataSource.filter = filterValue.trim().toLowerCase();
  }
}
