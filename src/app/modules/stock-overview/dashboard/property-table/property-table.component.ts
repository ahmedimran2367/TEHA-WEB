import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PropertyRequest } from '../../models/property-request.model';
import { StockOverviewService } from '../../stock-overview.service';
import {
  PropertyTableDataSource,
  PropertyTableItem,
} from './property-table-datasource';

@Component({
  selector: 'app-property-table',
  templateUrl: './property-table.component.html',
  styleUrls: ['./property-table.component.scss'],
})
export class PropertyTableComponent
  implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<PropertyTableItem>;
  dataSource: PropertyTableDataSource;
  @Input() freeText = '';
  @Input() searchPropertyId: number;
  @Output() propertySelectedOnDashboard = new EventEmitter<string>();
  propertyRequest: PropertyRequest = {
    userId: null,
    propertyIds: [],
    freeText: '',
    rwmStatus: null,
    accountingStatus: null,
    readingStatus: [],
    plumbingStatus: null,
    accountingMonth: null,
    dta: null,
    pageNo: 0,
    pageSize: 10,
    sort: {
      by: 'tehaLgNo',
      direction: 'asc',
    },
    includeChildren: true,
    payrollClosingYear: null
  };
  @Input() pageIndex = 0;
  @Input() pageSize = 4;
  sortBy = 'tehaLgNo';
  sortDirection = 'asc';

  selectedFilter = new Map<string, any>();



  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'tehaLgNo',
    'adminLgNo',
    'address',
    'rwm',
    'accPeriod',
    'accStatus',
    'readingStatus',
    'plumbingStatus',
    'openLetter',
    'createAnOrder',
  ];

  accountingMonths = [
    '31/1',
    '28/2',
    '31/3',
    '30/4',
    '31/5',
    '30/6',
    '31/7',
    '31/8',
    '30/9',
    '31/10',
    '30/11',
    '31/12'
  ];
  constructor(
    private stockOverviewService: StockOverviewService,
    private router: Router,
    private browserService: BrowserStorageService,
    public defaultDataService: DefaultDataService,
    public utilityService: UtilityService,
    private translate: TranslateService,
    private toastService: ToastService,
  ) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }

  ngOnInit(): void {
    const status = history.state.status;
    const filterType = history.state.type;
    if (status && filterType) {
      this.selectedFilter.set(filterType, status);
      this.propertyRequest[filterType] = status;
    }
    this.filterProperties();
    // debugger;
    // this.translate
    // .get('lookup.iN_PREPARATION')
    // .subscribe((value) => {
    //   debugger;
    //  this.translate.translations().set('lookup.IN_PREPARATION',value);
    // });
    // this.translate
    // .get('miscellaneous.couldNotDownload')
    // .subscribe((value) => {
    //  console.log()
    // });
    // this.defaultDataService.DefaultData.lookUps.accountingStatus.forEach(element=>{
    //   if(element.value === 'WAIT_DATA')
    //   {
    //     element.value = 'waiT_DATA';
    //   }
    //   else if(element.value === 'IN_PREPARATION')
    //   {
    //     element.value = 'iN_PREPARATION';
    //   }
    // })
    // this.defaultDataService.DefaultData.lookUps.plumbingStatus.forEach(element=>{
    //   if(element.value === 'NOT_PENDING')
    //   {
    //     element.value = 'noT_PENDING';
    //   }
    // })
    // this.defaultDataService.DefaultData.lookUps.readingStatus.forEach(element=>{
    //   if(element.value === 'NOT_PENDING')
    //   {
    //     element.value = 'noT_PENDING';
    //   }
    // })
  }

 
  onSearchChange($event, backPressed = false): void {
    this.freeText = $event;
    this.propertyRequest.pageNo = 0;
    this.paginator.pageIndex = 0;
    if (backPressed) {
      if (this.freeText == '') {
        this.filterProperties();
      }
    }
    else {
      if (this.freeText) {
        if (this.freeText.length > 0) {
          this.filterProperties();
        }
      } else {
        this.filterProperties();
      }
    }
  }

  setColor(element, item): boolean {
    if (element === 'monthMenu') {
      return item.substring(3) === this.selectedFilter.get(element) ? true : false;
    }
    return item.code === this.selectedFilter.get(element) ? true : false;
  }

  removeFilter(element): void {
    this.propertyRequest.pageNo = 0;
    this.paginator.pageIndex = 0;
    this.selectedFilter.delete(element);
    if (element === 'monthMenu') {
      this.propertyRequest.accountingMonth = null;
    } else {
      this.propertyRequest[element] = null;
    }
    this.filterProperties();
  }
  onFilterClick(filterType, item): void {
    this.propertyRequest.pageNo = 0;
    this.paginator.pageIndex = 0;

    if (filterType === 'monthMenu') {
      this.selectedFilter.set(filterType, item.substring(3));
      this.propertyRequest.accountingMonth = Number.parseInt(item.substring(3), 10);
      this.filterProperties();
    }
    else {
      this.selectedFilter.set(filterType, item.code);
      if (filterType !== 'readingStatus'){
        this.propertyRequest[filterType] = item.code;
      }else {
        if (this.propertyRequest.readingStatus.length === 0){
          this.selectedFilter.delete(filterType);
        }
      }
      this.filterProperties();
    }
  }

  getFilterList(filterType: string): any[] {
    let filterArray: any[];

    if (filterType === 'monthMenu') {
      filterArray = this.accountingMonths;
    }
    else {
      filterArray = this.defaultDataService.DefaultData.lookUps[filterType];
    }
    return filterArray;
  }
  onOrdersClick(orderType: string, propertyId: number): void {
    this.browserService.setlocalStorage('currentPropertyId', propertyId);
    if (orderType === 'energyPerformance') {
      this.router.navigate([
        '/orders/energyperformancecertificate',
        propertyId,
      ]);
    } else if (orderType === 'drinkingWater') {
      this.router.navigate(['/orders/wateranalysis', propertyId]);
    } else {
      this.browserService.setlocalStorage('readingLevel', 'Property');
      this.router.navigate(['/orders/reading', propertyId]);
    }
  }

  downloadOpenLetter(propertyId: number, tehaLgNo: number): void {
    this.stockOverviewService.downloadOpenLetter(propertyId).subscribe((m) => {
      const byteArray = new Uint8Array(
        atob(m.data.content)
          .split('')
          .map((char) => char.charCodeAt(0))
      );
      const extension = String(m.data.filename).substr(-3, 3);
      const blob = new Blob([byteArray], { type: 'application/' + extension });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = m.data.filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
      link.remove();
    },
      (err) => {
        this.translate
          .get('miscellaneous.couldNotDownload')
          .subscribe((value) => {
            this.toastService.openSnackError(value);
          });
      });
  }

  onPropertyClick(id: number): void {
    this.browserService.setlocalStorage('currentPropertyId', id);
    this.router.navigate(['/stockoverview/flat', id]);
  }
  onPageChange($event): void {
    this.propertyRequest.freeText = this.freeText = '';
    this.propertyRequest.pageNo = $event.pageIndex;
    this.propertyRequest.pageSize = $event.pageSize;
    this.filterProperties();
  }
  filterProperties(): void {
    if (this.searchPropertyId) {
      this.propertyRequest.propertyIds.push(this.searchPropertyId);
      this.searchPropertyId = null;
    } else {
      this.propertyRequest.propertyIds = [];
    }
    this.propertyRequest.freeText = this.freeText;
    this.propertyRequest.includeChildren = false;
    this.propertyRequest.pageSize = parseInt(String(this.pageSize), 10);
    this.stockOverviewService
      .getProperties(
        this.propertyRequest
      )
      .subscribe(
        (m) => {
          if (this.propertyRequest.propertyIds[0]) {
            this.freeText = m.data.items.find(p => p.id === this.propertyRequest.propertyIds[0]).tehaLgNo;
            this.propertySelectedOnDashboard.emit(this.freeText);
          }
          this.stockOverviewService.propertyData = m.data.items;
          this.dataSource = new PropertyTableDataSource(m.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.dataSource.paginator.length = m.data.totalRecords;
          this.table.dataSource = this.dataSource;
          console.log(this.dataSource)
        },
        () => {
          this.stockOverviewService.propertyData = [];
          this.dataSource = new PropertyTableDataSource({});
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.dataSource.paginator.length = 0;
          this.table.dataSource = this.dataSource;
          console.log(this.dataSource)
        }
      );
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((m) => {
      this.propertyRequest.pageNo = 0;
      this.paginator.pageIndex = 0;
      this.propertyRequest.sort.by = m.active;
      if (m.direction === '') {
        this.propertyRequest.sort.by = 'tehaLgNo';
        this.propertyRequest.sort.direction = 'asc';
      }
      else {
        this.propertyRequest.sort.direction = m.direction;
      }
      this.filterProperties();
    });

    // this.sort.sortChange.subscribe((m) => {
    //   console.log(m);
    //   if (m.direction !== this.sort.start || m.direction !== 'asc') {
    //     this.propertyRequest.sort.by = m.active;
    //     this.propertyRequest.sort.direction = m.direction === '' ? 'asc' : m.direction;
    //     this.filterProperties();
    //   }
    // });
  }
}
