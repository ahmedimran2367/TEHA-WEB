import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DocumentArchivesService } from '../../document-archives.service';
import { DocumentInfo } from '../../models/document-info.model';

@Component({
  selector: 'app-all-document-table',
  templateUrl: './all-document-table.component.html',
  styleUrls: ['./all-document-table.component.scss'],
})
export class AllDocumentTableComponent
  implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  dataSourceProperty: MatTableDataSource<DocumentInfo>;
  dataSourceFlat: MatTableDataSource<DocumentInfo>;
  dataSourceMeter: MatTableDataSource<DocumentInfo>;
  @ViewChild('paginatorFlat') paginatorFlat: MatPaginator;
  @ViewChild('paginatorProperty') paginatorProperty: MatPaginator;
  @ViewChild('paginatorMeter') paginatorMeter: MatPaginator;
  @Input() payrollYear: number;
  @Output() onTabChanged = new EventEmitter<boolean>();
  pageSize: number;
  tabIndex= 0;
  selectedFilter = new Map<string, any>();
  statusList = ['Paid', 'Unpaid'];
  originalPropertyDocumentData: DocumentInfo[];
  originalFlatDocumentData: DocumentInfo[];
  originalMeterDocumentData: DocumentInfo[];
  titleFilterText = '';
  selectedTabIndex = 0;
  searchText = '';
  constructor(
    private documentArchivesService: DocumentArchivesService,
    public defaultDataService: DefaultDataService,
    public utility: UtilityService,
    private translate: TranslateService,
    private toastService: ToastService
  ) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayColumnsProperty = ['title', 'creationDate', 'type', 'download'];
  displayColumnsFlats = [
    'tehaUserNo',
    'rentNo',
    'adminUserNo',
    'username',
    'title',
    'type',
    'creationDate',
    'download',
  ];
  displayColumnsMeters = [
    'tehaUserNo',
    'adminUserNo',
    'username',
    'title',
    'type',
    'meterTypeDesc',
    'location',
    'serialNumber',
    'creationDate',
    'download',
  ];

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change', this.payrollYear);

    this.documentArchivesService
      .getDocuments(this.payrollYear, 'ALL', true, true, true)
      .subscribe(
        (m) => {
          // m.data.propertyDocuments[0].title = '784 25/1' ;
          // m.data.flatsDocuments.map(f => {
          // const userNo = f.adminUserNo.split(' ');
          // f.adminUserNo = userNo[0] + ' ' + userNo[userNo.length-1]})
          this.originalPropertyDocumentData = m.data.propertyDocuments;
          this.originalFlatDocumentData = m.data.flatsDocuments;
          this.originalMeterDocumentData = m.data.meterDocuments;
          this.dataSourceProperty = new MatTableDataSource(
            m.data.propertyDocuments
          );
          this.dataSourceFlat = new MatTableDataSource(m.data.flatsDocuments);
          this.dataSourceMeter = new MatTableDataSource(m.data.meterDocuments);
           // Data transfermation before binding...location
           const allLocaions = this.defaultDataService.DefaultData.lookUps
           .location;
         this.dataSourceMeter.data.forEach((element) => {
           allLocaions.forEach((innerElement) => {
             if (element['location'] === innerElement.code) {
               element['location'] = innerElement.value;
             }
           });
         });
          this.dataSourceProperty.paginator = this.paginatorProperty;
          this.dataSourceFlat.paginator = this.paginatorFlat;
          this.dataSourceMeter.paginator = this.paginatorMeter;
          this.selectedFilter = new Map<string, any>();
          this.titleFilterText = '';
        },
        () => {
          this.originalPropertyDocumentData = [];
          this.originalFlatDocumentData = [];
          this.originalMeterDocumentData = [];
          this.dataSourceProperty = new MatTableDataSource([]);
          this.dataSourceFlat = new MatTableDataSource([]);
          this.dataSourceMeter = new MatTableDataSource([]);
          this.dataSourceProperty.paginator = this.paginatorProperty;
          this.dataSourceFlat.paginator = this.paginatorFlat;
          this.dataSourceMeter.paginator = this.paginatorMeter;
          this.selectedFilter = new Map<string, any>();
          this.titleFilterText = '';
        }
      );
  }

  getValueofLookup(code: string): string {
    return this.defaultDataService.DefaultData.lookUps.documentType.find(
      (dt) => dt.code === code
    ).value;
  }
  stopPropagation(event): void {
    event.stopPropagation();
  }
  removeFilter(element): void {
    this.selectedFilter.delete(element);

    this.filterDocuments(element);
  }

  onFilterClick(element: string, item: any): void {
    this.selectedFilter.set(element, item.code);

    this.filterDocuments(element);

    console.log(this.selectedFilter);
  }

  filterDocuments(element: string): void {
    if (element === 'categoryProperty') {
      if (this.selectedFilter.has(element)) {
        this.dataSourceProperty = new MatTableDataSource(
          this.originalPropertyDocumentData.filter(
            (m) =>
              m.type === this.selectedFilter.get(element) &&
              m.title.toLowerCase().includes(this.titleFilterText)
          )
        );
      } else {
        this.dataSourceProperty = new MatTableDataSource(
          this.originalPropertyDocumentData.filter((f) =>
            f.title.toLowerCase().includes(this.titleFilterText)
          )
        );
      }
      this.dataSourceProperty.paginator = this.paginatorProperty;
    } else if (element === 'categoryFlat') {
      if (this.selectedFilter.has(element)) {
        this.dataSourceFlat = new MatTableDataSource(
          this.originalFlatDocumentData.filter(
            (m) => m.type === this.selectedFilter.get(element)
          )
        );
      } else {
        this.dataSourceFlat = new MatTableDataSource(
          this.originalFlatDocumentData
        );
      }
      this.dataSourceFlat.paginator = this.paginatorFlat;
    } else {
      if (this.selectedFilter.has(element)) {
        this.dataSourceMeter = new MatTableDataSource(
          this.originalMeterDocumentData.filter(
            (m) => m.type === this.selectedFilter.get(element)
          )
        );
      } else {
        this.dataSourceMeter = new MatTableDataSource(
          this.originalMeterDocumentData
        );
      }
      this.dataSourceMeter.paginator = this.paginatorMeter;
    }
    this.searchChanged(this.searchText);
  }

  onTitleFilterChanged($event): void {
    console.log($event.target.value);
    this.titleFilterText = $event.target.value.toLowerCase();
    this.filterDocuments('categoryProperty');
  }

  searchChanged(filterText: string): void {
    this.searchText = filterText;
    if (this.selectedTabIndex === 1) {
      this.dataSourceFlat.filter = filterText.trim().toLowerCase();
    } else if (this.selectedTabIndex === 2) {
      this.dataSourceMeter.filter = filterText.trim().toLowerCase();
    }
  }
  tabChanged($event): void {
    this.selectedTabIndex = $event.index;
    if ($event.index === 1 || $event.index === 2) {
      this.onTabChanged.emit(false);
    } else {
      this.onTabChanged.emit(true);
    }
  }

  checkDocsAvailableFlat(): boolean {
    const available = this.dataSourceFlat?.data?.find(
      (f) => f.creationDate !== null
    );
    if (available) {
      return true;
    }
    return false;
  }
  checkDocsAvailableProp(): boolean {
    const available = this.dataSourceProperty?.data?.find(
      (p) => p.creationDate !== null
    );
    if (available) {
      return true;
    }
    return false;
  }
  checkDocsAvailableMeter(): boolean {
    const available = this.dataSourceMeter?.data?.find(
      (m) => m.creationDate !== null
    );
    if (available) {
      return true;
    }
    return false;
  }

  downloadDocument(id: number, level: string, type: string, payRollYearId: number): void {
    this.documentArchivesService
      .downloadDocumentContent(id, type, level, type === 'A' ? payRollYearId : this.payrollYear)
      .subscribe(
        (m) => {
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
        }
      );
  }
  ngAfterViewInit(): void {}
}
