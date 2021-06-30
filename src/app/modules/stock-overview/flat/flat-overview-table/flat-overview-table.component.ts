import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { StockOverviewService } from '../../stock-overview.service';
import { Flat } from '../../models/Flat.model';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-flat-overview-table',
  templateUrl: './flat-overview-table.component.html',
  styleUrls: ['./flat-overview-table.component.scss'],
})
export class FlatOverviewTableComponent
  implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Flat>;
  dataSource: MatTableDataSource<Flat>;
  @Input() propertyId: number;
  searchFlatData: Flat[];
  @Input() freeText: string;

  originalFlatData: Flat[];
  selectedFilter = new Map<string, any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'tehaUserNo',
    'adminUserNo',
    'location',
    'tenantName',
    'rwmStatus',
    'readingStatus',
    'plumbingStatus',
    'createanorder',
  ];
  pageSize: number;
  constructor(
    private router: Router,
    private stockOverviewService: StockOverviewService,
    private browserService: BrowserStorageService,
    public defaultDataService: DefaultDataService,
    public utilityService: UtilityService,
    private translate: TranslateService,
    private toastService: ToastService,
  ) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }
  ngOnInit(): void {
    this.stockOverviewService
      .getFlats(this.propertyId, null, false)
      .subscribe((m) => {
        this.originalFlatData = m.data.items;
        this.stockOverviewService.flatData = m.data.items;
        this.dataSource = new MatTableDataSource(m.data.items);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.applyFilter(this.freeText);
      });
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
  onFlatClick(id: number): void {
    this.stockOverviewService.flatId = id;
    this.router.navigate(['/stockoverview/meters', id]);
  }
  ngOnChanges(): void {
    if (this.dataSource) {
      this.applyFilter(this.freeText);
    }
  }
  onFilterClick(filterType, item): void {
    this.selectedFilter.set(filterType, item.code);

    this.filterFlats();

    console.log(this.selectedFilter);
  }

  filterFlats(): void {
    this.dataSource = new MatTableDataSource(
      this.originalFlatData.filter((f) => {
        let truth = true;
        this.selectedFilter.forEach((value, key) => {
          truth = truth && f[key] === value;
        });
        return truth;
      })
    );
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.applyFilter(this.freeText);
  }
  removeFilter(element): void {
    this.selectedFilter.delete(element);

    this.filterFlats();
  }

  downloadOpenLetter(
    propertyId: number,
    flatId: number,
    tehaUserNo: number
  ): void {
    this.stockOverviewService
      .downloadOpenLetter(propertyId, flatId)
      .subscribe((m) => {
        const byteArray = new Uint8Array(
          atob(m.data)
            .split('')
            .map((char) => char.charCodeAt(0))
        );
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Open Letter-flat-${tehaUserNo.toString()}.pdf`;
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

  onOrdersClick(orderType: string, flatId: number): void {
    this.stockOverviewService.flatId = flatId;
    if (orderType === 'orderReading') {
      this.browserService.setlocalStorage('readingLevel', 'Flat');
      this.router.navigate(['/orders/reading', flatId]);
    } else if (orderType === 'enterInterimReading') {
      this.router.navigate(['/orders/enterintermreading', flatId]);
    } else if (orderType === 'interim') {
      this.router.navigate(['/orders/interimreading', flatId]);
    } else if (orderType === 'orderPlumbing') {
      this.browserService.setlocalStorage('plumbingLevel', 'Flat');
      this.router.navigate(['/orders/plumbing', flatId], {
        state: {
          propertyId: this.browserService.getlocalStorage('currentPropertyId'),
          flatId,
          meterId: null,
          allMeters: null
        },
      });
    } else {
      this.browserService.setlocalStorage('testLevel', 'Flat');
      this.router.navigate(['/orders/smokedetector', flatId]);
    }
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {}
  redirectToAllMeters(): void{
    this.router.navigate(['/stockoverview/allmeters'], {
      state: {
        allMeters: true,
        toAllMetersFromMeterScreen: false
      },
    });
  }
}
