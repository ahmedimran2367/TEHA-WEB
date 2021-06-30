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
import { DocumentArchivesService } from '../../document-archives.service';
import { Invoice } from '../../models/invoice.model';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { formatCurrency } from '@angular/common';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss'],
})
export class InvoiceTableComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Invoice>;
  dataSource: MatTableDataSource<Invoice>;
  @Input() payrollYear: number;
  @Input() allBuildingsInd: boolean;

  selectedFilter: string;
  statusList = ['Paid', 'Unpaid'];
  originalInvoiceData: Invoice[];
  titleFilterText = '';
  invoiceNumberText = '';
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [];
  pageSize: number;

  constructor(
    private documentArchivesService: DocumentArchivesService,
    public defaultDataService: DefaultDataService,
    private translate: TranslateService,
    private toastService: ToastService,
    public utilityService: UtilityService,
    private router: Router
  ) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
    
  }
  ngOnInit(): void {
    if(this.allBuildingsInd){
      this.displayedColumns = [
        'tehaLgNo',
        'adminLgNo',
        'address',
        'title',
        'amount',
        'invoiceNo',
        'date',
        'status',
        'balance',
        'download', 
      ]
    }else{
      this.displayedColumns = [
        'title',
        'amount',
        'invoiceNo',
        'date',
        'status',
        'balance',
        'download',
      ];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change', this.payrollYear);

    this.documentArchivesService.getInvoices(this.allBuildingsInd, this.payrollYear).subscribe(
      (m) => {
        m.data.map(
          (i: Invoice) =>
            (i.amount = formatCurrency(Number(i.amount), 'en-de', '€'))
        );
        this.originalInvoiceData = m.data;
        this.dataSource = new MatTableDataSource(m.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.table.dataSource = this.dataSource;
        this.titleFilterText = '';
        this.invoiceNumberText = '';
        this.selectedFilter = null;
        if (history.state.status) {
          this.selectedFilter = history.state.status;
          this.filterInvoices();
        }
      },
      () => {
        this.originalInvoiceData = [];
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.table.dataSource = this.dataSource;
        this.titleFilterText = '';
        this.invoiceNumberText = '';
        this.selectedFilter = null;
      }
    );
  }

  goToAllBuildingsInvoices(): void {
    this.router.navigate(['/documentarchives/allbuildingsinvoice']);
  }

  stopPropagation(event): void {
    event.stopPropagation();
  }
  downloadDocument(
    id: number,
    type: string,
    fileName: string,
    invoiceNo: number
  ): void {
    // type = type === 'InvoiceService' ? 'Invoice' : type;
    this.documentArchivesService.downloadDocumentContent(id, type).subscribe(
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

  removeFilter(): void {
    this.selectedFilter = null;

    this.filterInvoices();
  }

  onFilterClick(item): void {
    this.selectedFilter = item.code;

    this.filterInvoices();

    console.log(this.selectedFilter);
  }

  filterInvoices(): void {
    if (this.selectedFilter) {
      this.dataSource = new MatTableDataSource(
        this.originalInvoiceData.filter(
          (m) =>
            m.status === this.selectedFilter &&
            m.title.toLowerCase().includes(this.titleFilterText) &&
            m.invoiceNo.includes(this.invoiceNumberText)
        )
      );
    } else {
      this.dataSource = new MatTableDataSource(
        this.originalInvoiceData.filter(
          (f) =>
            f.title.toLowerCase().includes(this.titleFilterText) &&
            f.invoiceNo.includes(this.invoiceNumberText)
        )
      );
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onTextFilterChanged($event, filterType: number): void {
    console.log($event.target.value);
    filterType === 0
      ? (this.titleFilterText = $event.target.value.toLowerCase())
      : (this.invoiceNumberText = $event.target.value.toLowerCase());
    this.filterInvoices();
  }
  ngAfterViewInit(): void {}
}
