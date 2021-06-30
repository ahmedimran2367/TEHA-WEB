import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface OrderPlumbingTableTwoItem {
  tehalgno: number;
  adminlgno: number;
  meterserial: number;
  meterty: string;
  address: string;
  date: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: OrderPlumbingTableTwoItem[] = [
  { tehalgno: 4567, adminlgno: 2345, meterserial: 1234, meterty: 'rth', address: 'floor 5', date: '34 nov 1345' }
];

/**
 * Data source for the OrderPlumbingTableTwo view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class OrderPlumbingTableTwoDataSource extends DataSource<OrderPlumbingTableTwoItem> {
  data: OrderPlumbingTableTwoItem[] = EXAMPLE_DATA;
  sort: MatSort;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<OrderPlumbingTableTwoItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    return observableOf(this.data);
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */

}

