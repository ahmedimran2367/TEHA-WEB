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
import { TranslateService } from '@ngx-translate/core';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountService } from '../../account.service';

@Component({
  selector: 'app-my-contracts-table',
  templateUrl: './my-contracts.component.html',
  styleUrls: ['./my-contracts.component.scss'],
})
export class MyContractsTableComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ContractTableItem>;
  dataSource: MatTableDataSource<ContractTableItem>;
  @Input() searchText: string;
  pageSize: number;
  selectedFilter: string = null;
  originalContractData: ContractTableItem[];

  constructor(
    private accountService: AccountService,
    public defaultDataService: DefaultDataService,
    private translate: TranslateService,
    private toastService: ToastService,
    public utilityService: UtilityService
  ) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'tehaLgNo',
    'adminLgNo',
    'street',
    'postcode',
    'city',
    'contractType',
    'startDate',
    'endDate',
    'download',
  ];
  ngOnInit(): void { }

  getContracts(index: number): void {
    if (index === 3 && !this.originalContractData) {
      this.accountService.getContracts().subscribe((m) => {
        let contracts: ContractTableItem[] = m.data.map((c) => {
          return {
            id: c.id,
            userId: c.userId,
            startTime: c.startTime,
            endTime: c.endTime,
            propertyId: c.property?.id,
            tehaLgNo: c.property?.tehaLgNo,
            adminLgNo: c.property?.adminLgNo,
            street: c.property?.street,
            postcode: c.property?.postcode,
            place: c.property?.place,
            contractType: c.contractType,
          };
        });
        this.originalContractData = contracts;
        this.dataSource = new MatTableDataSource(contracts);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.applyFilter(this.searchText);
      });
    }
  }

  downlaodDocument(
    contractId: number,
    propertyId: number,
    tehaLgNo: string,
    contractType: string
  ): void {
    this.accountService.getContractDocument(contractId, propertyId).subscribe(
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
        let link = document.createElement('a');
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
  ngOnChanges(): void {
    if (this.dataSource) {
      this.applyFilter(this.searchText);
    }
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngAfterViewInit(): void { }

  stopPropagation(event): void {
    event.stopPropagation();
  }
  removeFilter(): void {
    this.selectedFilter = null;

    this.filterContracts();
  }

  onFilterClick(item: any): void {
    this.selectedFilter = item.code;

    this.filterContracts();

    console.log(this.selectedFilter);
  }

  filterContracts(): void {
    if (this.selectedFilter) {
      this.dataSource = new MatTableDataSource(
        this.originalContractData.filter(
          (m) => m.contractType === this.selectedFilter
        )
      );
    } else {
      this.dataSource = new MatTableDataSource(this.originalContractData);
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.applyFilter(this.searchText);
  }
  reloadTable(): void {
    this.pageSize = this.defaultDataService.DefaultData.systemSettings.gridPageSize;
    this.paginator.pageSize = this.pageSize;
    this.dataSource.paginator = this.paginator;
  }
}

export interface ContractTableItem {
  id: number;
  userId: number;
  startTime: Date;
  endTime?: any;
  propertyId: number;
  tehaLgNo: string;
  adminLgNo: string;
  street: string;
  postcode: string;
  place: string;
  contractType: string;
}
