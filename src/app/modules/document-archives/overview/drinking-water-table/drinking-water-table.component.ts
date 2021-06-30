import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { DocumentArchivesService } from '../../document-archives.service';
import { DocumentInfo } from '../../models/document-info.model';

@Component({
  selector: 'app-drinking-water-table',
  templateUrl: './drinking-water-table.component.html',
  styleUrls: ['./drinking-water-table.component.scss'],
})
export class DrinkingWaterTableComponent
  implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<DocumentInfo>;
  dataSource: MatTableDataSource<DocumentInfo>;
  @Input() payrollYear: number;
  pageSize: number;

  originalPropertyDocumentData: DocumentInfo[];
  titleFilterText = '';
  constructor(
    private documentArchivesService: DocumentArchivesService,
    defaultDataService: DefaultDataService,
    private translate: TranslateService,
    private toastService: ToastService
  ) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['title', 'creationDate', 'accountingPeriod', 'download'];
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change', this.payrollYear);

    this.documentArchivesService
      .getDocuments(this.payrollYear, 'D', true, false, false)
      .subscribe((m) => {
        this.originalPropertyDocumentData = m.data.propertyDocuments;
        this.dataSource = new MatTableDataSource(m.data.propertyDocuments);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
        this.titleFilterText = '';
      });
  }

  stopPropagation(event): void {
    event.stopPropagation();
  }

  filterDocuments(): void {
    this.dataSource = new MatTableDataSource(
      this.originalPropertyDocumentData.filter((f) =>
        f.title.toLowerCase().includes(this.titleFilterText)
      )
    );
    this.dataSource.paginator = this.paginator;
  }

  onTitleFilterChanged($event): void {
    console.log($event.target.value);
    this.titleFilterText = $event.target.value.toLowerCase();
    this.filterDocuments();
  }
  downloadDocument(id: number, fileName: string): void {
    this.documentArchivesService.downloadDocumentContent(id, 'D').subscribe(
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
