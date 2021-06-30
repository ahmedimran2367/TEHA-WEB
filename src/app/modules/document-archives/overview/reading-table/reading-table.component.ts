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
import { DocumentArchivesService } from '../../document-archives.service';
import { DocumentInfo } from '../../models/document-info.model';

@Component({
  selector: 'app-reading-table',
  templateUrl: './reading-table.component.html',
  styleUrls: ['./reading-table.component.scss'],
})
export class ReadingTableComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('paginatorFlat') paginatorFlat: MatPaginator;
  @ViewChild('paginatorProperty') paginatorProperty: MatPaginator;
  dataSourceProperty: MatTableDataSource<DocumentInfo>;
  dataSourceFlat: MatTableDataSource<DocumentInfo>;
  @Input() payrollYear: number;
  tabIndex = 0;
  pageSize: number;
  @Output() onTabChanged = new EventEmitter<boolean>();

  originalPropertyDocumentData: DocumentInfo[];
  titleFilterText = '';
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayColumnsProperty = [
    'title',
    'creationDate',
    'accountingPeriod',
    'download',
  ];
  displayColumnsFlats = [
    'tehaUserNo',
    'rentNo',
    'adminUserNo',
    'username',
    'title',
    'creationDate',
    'download',
  ];

  constructor(
    private documentArchivesService: DocumentArchivesService,
    defaultDataService: DefaultDataService,
    private translate: TranslateService,
    private toastService: ToastService
  ) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.documentArchivesService
      .getDocuments(this.payrollYear, 'R', true, true, false)
      .subscribe(
        (m) => {
          this.originalPropertyDocumentData = m.data.propertyDocuments;
          this.dataSourceProperty = new MatTableDataSource(
            m.data.propertyDocuments
          );
          this.dataSourceFlat = new MatTableDataSource(m.data.flatsDocuments);
          this.dataSourceProperty.paginator = this.paginatorProperty;
          this.dataSourceFlat.paginator = this.paginatorFlat;
          this.titleFilterText = '';
        },
        () => {
          this.originalPropertyDocumentData = [];
          this.dataSourceProperty = new MatTableDataSource([]);
          this.dataSourceFlat = new MatTableDataSource([]);
          this.dataSourceProperty.paginator = this.paginatorProperty;
          this.dataSourceFlat.paginator = this.paginatorFlat;
          this.titleFilterText = '';
        }
      );
  }

  stopPropagation(event): void {
    event.stopPropagation();
  }

  filterDocuments(): void {
    this.dataSourceProperty = new MatTableDataSource(
      this.originalPropertyDocumentData.filter((f) =>
        f.title.toLowerCase().includes(this.titleFilterText)
      )
    );
    this.dataSourceProperty.paginator = this.paginatorProperty;
  }

  onTitleFilterChanged($event): void {
    console.log($event.target.value);
    this.titleFilterText = $event.target.value.toLowerCase();
    this.filterDocuments();
  }
  tabChanged($event): void {
    if ($event.index === 1) {
      this.onTabChanged.emit(false);
    } else {
      this.onTabChanged.emit(true);
    }
  }

  searchChanged(filterText: string): void {
    this.dataSourceFlat.filter = filterText.trim().toLowerCase();
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
  downloadDocument(
    id: number,
    level: string,
    payrollYearId: number = null
  ): void {
    this.documentArchivesService
      .downloadDocumentContent(
        id,
        'R',
        level,
        payrollYearId ? payrollYearId : this.payrollYear
      )
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
