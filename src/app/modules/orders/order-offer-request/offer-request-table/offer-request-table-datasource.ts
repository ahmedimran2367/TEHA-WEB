import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf } from 'rxjs';

// TODO: Replace this with your own data model type
export interface OfferRequestTableItem {
  userName: string;
  newPropertyAddress: string;
  contractType: string;
  serviceType: string;
  measurementTechnology: string;
  requiredMeters: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: OfferRequestTableItem[] = [
  {
    userName: 'John Doe',
    newPropertyAddress: 'Waldowstr. 90\, Waakirchen 88657',
    contractType: 'Maintenance',
    serviceType: 'Accounting',
    measurementTechnology: 'Radio',
    requiredMeters: '01x Heat Cost Allocator'
  }
];

/**
 * Data source for the OfferRequestTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class OfferRequestTableDataSource extends DataSource<OfferRequestTableItem> {
  data: OfferRequestTableItem[] = EXAMPLE_DATA;
  sort: MatSort;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<OfferRequestTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    return observableOf(this.data);
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void { }
}
