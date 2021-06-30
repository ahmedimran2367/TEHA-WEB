import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { OrdersService } from 'src/app/modules/orders/services/orders.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {OfferDataTableItem} from '../../models/offer.model';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.scss']
})

export class MyOffersComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<OfferDataTableItem>;
  dataSource: MatTableDataSource<OfferDataTableItem>;
  @Input() searchText: string;
  pageSize: number;
  selectedFilter: string = null;
  originalContractData: OfferDataTableItem[];

  constructor(
    private ordersService: OrdersService,
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
    'type',
    'creationDate',
    'download',
  ];
  ngOnInit(): void { 
    if(history.state.selectedTabId)
    {
      this.getOffers(history.state.selectedTabId);
    }
  }

  getOffers(index: number): void {
    if (index === 4 && !this.originalContractData) {
      this.ordersService.getOffers().subscribe((m) => {
        console.log('offers response',m)
        let offers: OfferDataTableItem[] = m.data.map((c) => {
          return {
            id: c.id,
            userId: c.userId,
            creationDate: c.creationDate,
            tehaLgNo: c.tehaLgNo,
            adminLgNo: c.adminLgNo,
            street: c.street,
            postcode: c.postcode,
            city: c.city,
            type: c.type
          };
        });
        this.originalContractData = offers;
        this.dataSource = new MatTableDataSource(offers);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.applyFilter(this.searchText);
      });
    }
  }

  downlaodDocument(
    offerId: number,
    // propertyId: number,
    // tehaLgNo: string,
    // contractType: string
  ): void {
    this.ordersService.getOfferDocument(offerId).subscribe(
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
          (m) => m.type === this.selectedFilter
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
