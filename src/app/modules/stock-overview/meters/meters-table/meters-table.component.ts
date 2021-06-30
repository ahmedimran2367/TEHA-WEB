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
import { TranslateService } from '@ngx-translate/core';
import { DocumentArchivesService } from 'src/app/modules/document-archives/document-archives.service';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Meter } from '../../models/meter.model';
import { StockOverviewService } from '../../stock-overview.service';

@Component({
  selector: 'app-meters-table',
  templateUrl: './meters-table.component.html',
  styleUrls: ['./meters-table.component.scss'],
})
export class MetersTableComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Meter>;
  dataSource: MatTableDataSource<Meter>;
  @Input() flatId: number;
  @Input() freeText: string;
  @Input() allMetersIndicator: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [];
  meterData = [];
  pageSize: number;
  selectedFilter: string;
  originalMeterData: Meter[];

  constructor(
    private router: Router,
    private stockOverviewService: StockOverviewService,
    private browserService: BrowserStorageService,
    private defaultDataService: DefaultDataService,
    private translate: TranslateService,
    private toastService: ToastService,
    private documentArchivesService: DocumentArchivesService,
    public utilityService: UtilityService,
  ) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }
  ngOnInit(): void {
    console.log('file hitted');
    this.browserService.setlocalStorage('currentFlatId', this.flatId);
    if ((this.router.url).includes('allmeters')) {
      this.allMetersIndicator = true;
    }
    if (this.allMetersIndicator) {
      this.displayedColumns = [
        'tehaUserNo',
        'adminUserNo',
        'tenantName',
        'meterTypeDesc',
        'location',
        'serialNumber',
        'meterStatus',
        'plumbingStatus',
        'createanorder',
      ];
      this.stockOverviewService
        .getAllMeters(this.browserService.getlocalStorage('currentPropertyId'))
        .subscribe((m) => {
          this.stockOverviewService.meterData = m.data;
          this.meterData = m.data;
          // Data transfermation before binding...location
          const allLocaions = this.defaultDataService.DefaultData.lookUps
            .location;
          this.meterData.forEach((element) => {
            allLocaions.forEach((innerElement) => {
              if (element.location === innerElement.code) {
                element.location = innerElement.value;
              }
            });
          });
          this.originalMeterData = JSON.parse(JSON.stringify(this.meterData));
          this.dataSource = new MatTableDataSource(this.meterData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.applyFilter(this.freeText);
          });
      // this.meterData = this.meterData.concat(
      //   this.browserService
      //     .getSessionStorage('userProperties')
      //     .find(
      //       (p) =>
      //         p.id === this.browserService.getlocalStorage('currentPropertyId')waw
      //     ).generalMeters
      // );
    } else {
      this.displayedColumns = [
        'meterTypeDesc',
        'location',
        'serialNumber',
        'meterStatus',
        'plumbingStatus',
        'createanorder',
      ];
      this.stockOverviewService
        .getFlats(
          this.browserService.getlocalStorage('currentPropertyId'),
          this.flatId,
          true
        )
        .subscribe((m) => {
          this.stockOverviewService.meterData = m.data.items[0].meters;
          // Data transfermation before binding...location
          const allLocaions = this.defaultDataService.DefaultData.lookUps
            .location;
          this.stockOverviewService.meterData.forEach((element) => {
            allLocaions.forEach((innerElement) => {
              if (element.location === innerElement.code) {
                element.location = innerElement.value;
              }
            });
          });

          this.dataSource = new MatTableDataSource(m.data.items[0].meters);
          console.log(m.data.items[0].meters);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.applyFilter(this.freeText);
        });
    }
  }

  onFilterClick(item): void {
    this.selectedFilter = item.value;

    this.filterMeters();

    console.log(this.selectedFilter);
  }

  filterMeters(): void {
    if (this.selectedFilter) {
      this.dataSource = new MatTableDataSource(
        this.originalMeterData.filter(
          (m) => m.meterTypeDesc === this.selectedFilter
        )
      );
    } else {
      this.dataSource = new MatTableDataSource(this.originalMeterData);
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.applyFilter(this.freeText);
  }
  removeFilter(): void {
    this.selectedFilter = null;

    this.filterMeters();
  }

  ngOnChanges(): void {
    if (this.dataSource) {
      if (!this.dataSource.filter){
        this.dataSource.filterPredicate = (data, filter: string) => {
          return data.meterTypeDesc.toLowerCase().includes(filter) || data.location.toLowerCase().includes(filter) ||
          String(data.serialNumber).includes(filter);
        };
      }
      this.applyFilter(this.freeText);
    }
  }
  onOrdersClick(orderType: string, meterId: number): void {
    if (orderType === 'orderPlumbing') {
      this.browserService.setlocalStorage('plumbingLevel', 'Meter');
      if (this.allMetersIndicator)
      {
        const obj =   this.dataSource.filteredData.find(element => element['id'] == meterId);
        this.stockOverviewService.flatId = obj.flatId;
      }
      this.router.navigate(['/orders/plumbing', meterId], {
        state: {
          propertyId: this.browserService.getlocalStorage('currentPropertyId'),
          flatId: this.flatId,
          meterId,
          allMeters: this.allMetersIndicator
        },
      });
    } else if (orderType === 'smokeDetectorTest') {
      this.browserService.setlocalStorage('testLevel', 'Meter');
      if (this.allMetersIndicator)
      {
        const obj =   this.dataSource.filteredData.find(element => element['id'] == meterId);
        this.browserService.setlocalStorage('currentFlatId', obj.flatId);
      }
      this.router.navigate(['/orders/smokedetector', meterId]);
    } else if (orderType === 'orderReading')
    {
      this.browserService.setlocalStorage('readingLevel', 'Meter');
      this.router.navigate(['/orders/reading', meterId]);
    }
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  downloadDocument(id: number, level: string, type: string): void {
    this.documentArchivesService
      .downloadDocumentContent(id, type, level, null)
      .subscribe((m) => {
        const byteArray = new Uint8Array(
          atob(m.data.content)
            .split('')
            .map((char) => char.charCodeAt(0))
        );
        const extension = String(m.data.filename).substr(-3, 3);
        const blob = new Blob([byteArray], {
          type: 'application/' + extension,
        });
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

  ngAfterViewInit(): void {}
  redirectToAllMeters(): void{
    this.router.navigate(['/stockoverview/allmeters'], {
      state: {
        allMeters: true,
        toAllMetersFromMeterScreen: true
      },
    });
  }
}
