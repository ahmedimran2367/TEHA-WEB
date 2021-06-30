import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

import { MatTable } from '@angular/material/table';
import { OrderTableDataSource } from './order-table-datasource';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { ResponseStatus } from 'src/app/shared/models/Response';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogConfig } from 'src/app/shared/models/dialog-config.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss']
})
export class OrderTableComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Order>;
  dataSource: OrderTableDataSource;
  @Input() freeText = '';
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  sortBy = 'tehaLgNo';
  sortDirection = 'asc';
  selectedFilter = new Map<string, any>();
  originalOrdersResponse: any;
  type: string[] = [];
  status: string[] = [];
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'tehaLgNo',
    'adminLgNo',
    'tehaUserNo',
    'adminUserNo',
    'description',
    'type',
    'status',
    'creationDate',
    'editOrder',
    'cancelAnOrder'
  ];

  constructor(
    private orderService: OrdersService,
    private defaultData: DefaultDataService,
    private toastService: ToastService,
    public defaultDataService: DefaultDataService,
    public utilityService: UtilityService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.pageSize = this.defaultData.DefaultData.systemSettings?.gridPageSize;
  }

  ngOnInit(): void {
    if (history.state.status && history.state.type) {
      this.status = history.state.status;
      this.type = history.state.type;

      this.selectedFilter.set('orderType', this.type);
      this.selectedFilter.set('orderStatus', this.status);
    }

    this.filterOrders();
  }

  filterOrders(backPressed = false): void {
    if (this.freeText != '' || backPressed) {
      this.pageIndex = 0;
    }
    this.orderService.getOrders(this.freeText, this.type, this.status, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection)
      .subscribe(res => {
        console.log('Cancel response data', res.data);
        this.originalOrdersResponse = res.data;
        this.dataSource = new OrderTableDataSource(res.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.length = res.data.totalRecords;
        this.table.dataSource = this.dataSource;
      },
        () => {
          this.dataSource = new OrderTableDataSource({});
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.dataSource.paginator.length = 0;
          this.table.dataSource = this.dataSource;
        }
      );
  }

  onPageChange($event): void {
    this.freeText = '';
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.filterOrders();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((m) => {
      this.sortBy = m.active;
      if (m.direction === '') {
        this.sortBy = 'tehaLgNo';
        this.sortDirection = 'asc';
      }
      else {
        this.sortDirection = m.direction;
      }
      this.filterOrders();
    });
  }

  freeTextSearch(value, backPressed = false): void {
    this.freeText = value;

    if (backPressed) {
      if (this.freeText == '') {
        this.filterOrders(backPressed);
      }
    }
    else {
      this.filterOrders();
    }
  }

  cancelOrder(id: any): void {
    let title: string;
    let message: string;
    let cancelledToastMsg: string;
    let notCancelToastMsg: string;
    let cancelBtn: string;
    let confirmBtn: string;
    this.translate
      .get([
        'order.couldNotCancel',
        'order.orderCancelled',
        'order.no',
        'order.yes',
        'order.sureCancelMsg',
        'order.cancelOrder',
      ])
      .subscribe((values) => {
        title = values['order.cancelOrder'];
        message = values['order.sureCancelMsg'];
        cancelledToastMsg = values['order.orderCancelled'];
        notCancelToastMsg = values['order.couldNotCancel'];
        cancelBtn = values['order.no'];
        confirmBtn = values['order.yes'];
      });
    const config: DialogConfig = {
      title,
      message,
      cancelButtonLabel: cancelBtn,
      confirmButtonLabel: confirmBtn,
    };

    let dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
    });
    dialogRef.componentInstance.config = config;

    dialogRef.afterClosed().subscribe((result) => {

      if (result === 'confirm') {

        this.orderService.cancelOrder(id).subscribe(res => {
          if (res.status == ResponseStatus.OK) {
            const indexToDelete = this.originalOrdersResponse.items.findIndex(o => o.id === id);
            if (indexToDelete !== -1) {
              console.log('deleted');
              this.originalOrdersResponse.items.splice(indexToDelete, 1);
              this.dataSource = new OrderTableDataSource(this.originalOrdersResponse);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.dataSource.paginator.length = this.originalOrdersResponse.items.length;
              this.table.dataSource = this.dataSource;
            }
            this.toastService.openSnackSuccessfully(cancelledToastMsg);
          }
        },
          () => {
            this.toastService.openSnackError(notCancelToastMsg);
          });
      }
    });
  }

  editOrder(orderId: number, propertyId: number, flatId: number, type: string): void {
    switch (type) {
      case 'drinkingWaterSampling':
        this.router.navigate(['/orders/wateranalysis'], { state: { orderId, propertyId, flatId } });
        break;
      case 'energyCertificate':
        this.router.navigate(['/orders/energyperformancecertificate'], { state: { orderId, propertyId, flatId } });
        break;
      case 'interimReading':
        this.router.navigate(['/orders/interimreading'], { state: { orderId, propertyId, flatId } });
        // this.router.navigate(['/orders/interimreading']);
        break;
      case 'offer':
        this.router.navigate(['/orders/offerrequest'], { state: { orderId, propertyId, flatId } });
        break;
      case 'plumbing':
        this.router.navigate(['/orders/plumbing'], { state: { orderId, propertyId, flatId } });
        break;
      case 'postInterimReading':
        this.router.navigate(['/orders/enterintermreading'], { state: { orderId, propertyId, flatId } });
        break;
      case 'smokeDetectorTest':
        this.router.navigate(['/orders/smokedetector'], { state: { orderId, propertyId, flatId } });
        break;
      case 'smokeDetectorTest':
        this.router.navigate(['/orders/smokedetector'], { state: { orderId, propertyId, flatId } });
        // this.router.navigate(['/stockoverview/allmeters'], {state: {allMeters: true}});
        break;
      case 'reading':
        this.router.navigate(['/orders/reading'], { state: { orderId, propertyId, flatId } });
        break;
      default:
        break;
    }
  }

  setColor(element, item): boolean {
    return item.code === this.selectedFilter.get(element) ? true : false;
  }
  removeFilter(element): void {
    if (element === 'orderType') {
      this.type = null;
      this.filterOrders();
    }
    else if (element === 'orderStatus') {
      this.status = null;
      this.filterOrders();
    }
    this.selectedFilter.delete(element);
    // this.filterProperties();
  }
  onFilterClick(filterType, item): void {
    this.pageIndex = 0;
    this.filterOrders();
    this.selectedFilter.set(filterType, item.code);
    if (filterType === 'orderType') {
      if (this.type.length === 0){
        this.selectedFilter.delete(filterType);
      }
    }
    else {
      if (this.status.length === 0){
        this.selectedFilter.delete(filterType);
      }
    }
  }

  getFilterList(filterType: string): any[] {
    let filterArray: any[];
    filterArray = this.defaultDataService.DefaultData.lookUps[filterType];
    return filterArray;
  }
}
