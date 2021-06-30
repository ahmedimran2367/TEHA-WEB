import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { PropertyInfo } from '../../../../shared/models/property-info.model';
import { DocumentArchivesService } from '../../document-archives.service';

@Component({
  selector: 'app-sepa-table',
  templateUrl: './sepa-table.component.html',
  styleUrls: ['./sepa-table.component.scss'],
})
export class SEPATableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable) table: MatTable<PropertyInfo>;
  dataSource: MatTableDataSource<PropertyInfo>;

  constructor(
    private documentArchivesService: DocumentArchivesService,
    private translate: TranslateService,
    private toastService: ToastService
  ) {}
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'tehaLgNo',
    'adminLgNo',
    'street',
    'postcode',
    'city',
    'download',
  ];
  ngOnInit(): void {
    this.documentArchivesService.getAllSepaDocuments().subscribe((m) => {
      this.dataSource = new MatTableDataSource(m);
      this.table.dataSource = this.dataSource;
    });
  }

  downloadDocument(sepaInd: boolean, street: string, tehaLgNo: number): void {
    this.documentArchivesService.downloadSepaContent(!sepaInd).subscribe(
      (m) => {
        const fileName = m.data.filename;
        const extension = String(fileName).substr(-3, 3);
        const byteArray = new Uint8Array(
          atob(m.data.content)
            .split('')
            .map((char) => char.charCodeAt(0))
        );
        const blob = new Blob([byteArray], {
          type: 'application/' + extension,
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
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
