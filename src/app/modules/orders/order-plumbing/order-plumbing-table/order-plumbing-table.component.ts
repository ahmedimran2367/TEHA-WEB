import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { StockOverviewService } from 'src/app/modules/stock-overview/stock-overview.service';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { OrderPlumbingTableItem } from '../../models/orderPlumbingTableItem';

@Component({
  selector: 'app-order-plumbing-table',
  templateUrl: './order-plumbing-table.component.html',
  styleUrls: ['./order-plumbing-table.component.scss'],
})
export class OrderPlumbingTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable) table: MatTable<OrderPlumbingTableItem>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  isDivHidden = false;
  @Output() hasClicked = new EventEmitter();
  pageSize = 10;
  placeOrderInd = false;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'tehaUserno',
    'adminUserno',
    'name',
    'location',
    'actions',
  ];

  /**
   *
   */
  constructor(
    private stockOverviewService: StockOverviewService,
    private browserService: BrowserStorageService,
    public defaultDataService: DefaultDataService,
  ) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }
  ngOnInit(): void {
    const plumbingLevel = this.browserService.getlocalStorage('plumbingLevel');
    if (plumbingLevel == 'MyOrderFloatFlat') {
      this.placeOrderInd = true;
    }
    else { this.placeOrderInd = false; }
    this.stockOverviewService
      .getFlats(this.browserService.getlocalStorage('currentPropertyId'), null, false)
      .subscribe(m => {
        this.dataSource = new MatTableDataSource(m.data.items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.stockOverviewService.flatData = m.data.items;
        // this.table.dataSource = this.dataSource;
      });
    // this.dataSource = new OrderPlumbingTableDataSource();
  }
  showButtonclicked(flatId: number): void {
    // this.isDivHidden = ! this.isDivHidden
    this.stockOverviewService.flatId = flatId;
    this.hasClicked.emit(flatId);
  }

  ngAfterViewInit(): void {
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
