import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { OfferRequestTableDataSource, OfferRequestTableItem } from './offer-request-table-datasource';

@Component({
  selector: 'app-offer-request-table',
  templateUrl: './offer-request-table.component.html',
  styleUrls: ['./offer-request-table.component.scss']
})
export class OfferRequestTableComponent implements AfterViewInit, OnInit {

  @ViewChild(MatTable) table: MatTable<OfferRequestTableItem>;
  dataSource: OfferRequestTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit(): void {
    this.dataSource = new OfferRequestTableDataSource();
  }

  ngAfterViewInit(): void {

    this.table.dataSource = this.dataSource;
  }
}
