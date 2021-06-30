import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { StockOverviewService } from '../../stock-overview/stock-overview.service';
import {
  PropertyTableDataSource,
  PropertyTableItem,
} from '../../stock-overview/dashboard/property-table/property-table-datasource';
import { AccountingService } from '../accounting.service';
import { DocumentArchivesService } from '../../document-archives/document-archives.service';
import { PayrollYear } from '../model/PayrollYear';
import { AccountingRequest } from '../model/Accounting';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';

@Component({
  selector: 'app-overview-grid',
  templateUrl: './overview-grid.component.html',
  styleUrls: ['./overview-grid.component.scss'],
})
export class OverviewGridComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<PropertyTableItem>;
  dataSource: PropertyTableDataSource;
  @Input() freeText = '';

  accountingRequest: AccountingRequest = {
    userId: null,
    propertyIds: [],
    freeText: '',
    accountingStatus: null,
    accountingMonth: null,
    dta: null,
    pageNo: 0,
    pageSize: 10,
    sort: {
      by: 'tehaLgNo',
      direction: 'asc',
    },
    payrollClosingYear: null,
  };
  @Input() pageIndex = 0;
  @Input() pageSize = 4;
  sortBy = 'tehaLgNo';
  sortDirection = 'asc';
  searchText = '';

  selectedFilter = new Map<string, any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'tehaLgNo',
    'adminLgNo',
    'address',
    'accPeriod',
    'accStatus',
    'dta',
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
    '31/12',
  ];

  propertyData: any[];
  dtaTooltip: '';
  constructor(
    private stockOverviewService: StockOverviewService,
    private router: Router,
    private browserService: BrowserStorageService,
    public defaultDataService: DefaultDataService,
    private accountingService: AccountingService,
    private documentArchivesService: DocumentArchivesService,
    private utilityService: UtilityService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
  ) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
    this.accountingRequest.pageSize = Number(this.pageSize);
    this.translate
      .get([
        'accounting.dtaTooltip',
      ])
      .subscribe((values) => {
        this.dtaTooltip = values['accounting.dtaTooltip'];
      });
  }

  ngOnInit(): void {
    const status = history.state.status;
    if (status) {
      this.selectedFilter.set('accountingStatus', status);
      this.accountingRequest.accountingStatus = status;
    }
    this.filterProperties();
  }

  // ngOnChanges(): void {
  //   console.log(this.freeText);
  //   if (this.freeText) {
  //     if (this.freeText.length > 2) {
  //       this.filterProperties();
  //     }
  //   } else {
  //     this.filterProperties();
  //   }
  // }

  setColor(element, item): boolean {
    if (element === 'monthMenu') {
      return item.substring(3) === this.selectedFilter.get(element)
        ? true
        : false;
    }
    return item.code === this.selectedFilter.get(element) ? true : false;
  }
  removeFilter(element): void {
    this.selectedFilter.delete(element);
    if (element === 'monthMenu') {
      this.accountingRequest.accountingMonth = null;
    } else {
      this.accountingRequest[element] = null;
    }
    this.filterProperties();
  }
  onFilterClick(filterType, item): void {
    this.accountingRequest.pageNo = 0;
    this.paginator.pageIndex = 0;
    if (filterType === 'monthMenu') {
      this.selectedFilter.set(filterType, item.substring(3));
      this.accountingRequest.accountingMonth = Number.parseInt(
        item.substring(3), 10
      );
      this.filterProperties();
    } else {
      this.selectedFilter.set(filterType, item.code);
      this.accountingRequest[filterType] = item.code;
      this.filterProperties();
    }
    console.log(this.selectedFilter);
  }

  getFilterList(filterType: string): any[] {
    let filterArray: any[];

    if (filterType === 'monthMenu') {
      filterArray = this.accountingMonths;
    } else {
      filterArray = this.defaultDataService.DefaultData.lookUps[filterType];
    }
    return filterArray;
  }
  onDataExchange(propertyId) {
    // /accounting/overview/dataExchange
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
      window.open(this.defaultDataService.DefaultData.systemSettings.dataExchangeUrl + "?userId=" + this.accountingService.user.id + "&propertyId=" + propertyId + "&token=" + currentUser.externalToken, "_blank");
    }
  }
  onPropertyClick(id: number): void {
    this.browserService.setlocalStorage('currentPropertyId', id);
    this.router.navigate(['/stockoverview/flat', id]);
  }
  onPageChange($event): void {
    this.accountingRequest.freeText = this.freeText = '';
    this.accountingRequest.pageNo = $event.pageIndex;
    this.accountingRequest.pageSize = Number($event.pageSize);
    this.filterProperties();
  }
  filterProperties(): void {
    this.accountingRequest.freeText = this.freeText;
    this.accountingService.getAccounting(this.accountingRequest).subscribe(
      (m) => {
        this.propertyData = m.data.items;
        this.dataSource = new PropertyTableDataSource(m.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.length = m.data.totalRecords;
        this.table.dataSource = this.dataSource;
      },
      () => {
        this.propertyData = [];
        this.dataSource = new PropertyTableDataSource({});
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.length = 0;
        this.table.dataSource = this.dataSource;
      }
    );
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((m) => {
      this.accountingRequest.sort.by = m.active;
      if (m.direction === '') {
        this.accountingRequest.sort.by = 'tehaLgNo';
        this.accountingRequest.sort.direction = 'asc';
      } else {
        this.accountingRequest.sort.direction = m.direction;
      }
      this.filterProperties();
    });
  }

  onChange(text, backPressed = false): void {
    this.freeText = text;
    if (backPressed) {
      if (this.freeText == '') {
        this.filterProperties();
      }
    } else {
      if (this.freeText) {
        if (this.freeText.length > 0) {
          this.accountingRequest.pageNo = 0;
          this.paginator.pageIndex = 0;
          this.filterProperties();
        }
      } else {
        this.filterProperties();
      }
    }
  }

  goForAccounting(propertyId, payrollYearId): void {
    this.accountingService.property = this.propertyData.find((obj) => {
      return obj.id === propertyId && obj.payrollYearId == payrollYearId;
    });
    this.browserService.setlocalStorage('currentPropertyId', propertyId);
    this.documentArchivesService.getPayrollYear().subscribe((m) => {
      let from = '';
      let to = '';
      const splitBillingPeriod = this.accountingService.property.billingPeriod.split(
        '-'
      );

      this.accountingService.currentBillingPeroid = new PayrollYear();
      let fromS = splitBillingPeriod[0].trim().split('/');
      this.accountingService.currentBillingPeroid.from =
        fromS[2] + '-' + fromS[1] + '-' + fromS[0];
      from = fromS[2] + '-' + fromS[1] + '-' + fromS[0];

      let toS = splitBillingPeriod[1].trim().split('/');
      this.accountingService.currentBillingPeroid.to =
        toS[2] + '-' + toS[1] + '-' + toS[0];
      console.log(this.accountingService.currentBillingPeroid);

      to = toS[2] + '-' + toS[1] + '-' + toS[0];

      let payRollYears = m.data;
      for (let i = 0; i < payRollYears.length; i++) {
        if (payRollYears[i].from == from && payRollYears[i].to == to) {
          this.accountingService.property.billingPeroidId = payRollYears[i].id;
          if (i + 1 < payRollYears.length) {
            // set last billing peroid Id
            this.accountingService.lastPayrollYearId = payRollYears[i + 1].id;
          } else {
            this.accountingService.lastPayrollYearId = 0;
          }
        }
      }
      this.router.navigate(['/accounting/overview/review'], {
        skipLocationChange: true,
      });
    });
  }
  onPayrollYearChange(event): void {
    this.accountingRequest.payrollClosingYear = event;
    this.filterProperties();
  }
}
