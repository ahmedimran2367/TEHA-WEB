import { DataSource } from '@angular/cdk/collections';
import { Observable, of as observableOf } from 'rxjs';

// TODO: Replace this with your own data model type
export interface OrderWaterAnalysisStep2TableItem {
  tehaLgNumber: number;
  adminLgNumber: number;
  street: string;
  postCode: number;
  city: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: OrderWaterAnalysisStep2TableItem[] = [
  {
    tehaLgNumber: 83662,
    adminLgNumber: 1100567,
    street: 'Waldowstr.90',
    postCode: 12345,
    city: 'Waakirchen'
  },
  {
    tehaLgNumber: 83662,
    adminLgNumber: 1100567,
    street: 'Waldowstr.90',
    postCode: 12345,
    city: 'Waakirchen'
  },
  {
    tehaLgNumber: 83662,
    adminLgNumber: 1100567,
    street: 'Waldowstr.90',
    postCode: 12345,
    city: 'Waakirchen'
  },
  {
    tehaLgNumber: 83662,
    adminLgNumber: 1100567,
    street: 'Waldowstr.90',
    postCode: 12345,
    city: 'Waakirchen'
  },
  {
    tehaLgNumber: 83662,
    adminLgNumber: 1100567,
    street: 'Waldowstr.90',
    postCode: 12345,
    city: 'Waakirchen'
  },
  {
    tehaLgNumber: 83662,
    adminLgNumber: 1100567,
    street: 'Waldowstr.90',
    postCode: 12345,
    city: 'Waakirchen'
  },
  {
    tehaLgNumber: 83662,
    adminLgNumber: 1100567,
    street: 'Waldowstr.90',
    postCode: 12345,
    city: 'Waakirchen'
  },
  {
    tehaLgNumber: 83662,
    adminLgNumber: 1100567,
    street: 'Waldowstr.90',
    postCode: 12345,
    city: 'Waakirchen'
  },
  {
    tehaLgNumber: 83662,
    adminLgNumber: 1100567,
    street: 'Waldowstr.90',
    postCode: 12345,
    city: 'Waakirchen'
  },
  {
    tehaLgNumber: 83662,
    adminLgNumber: 1100567,
    street: 'Waldowstr.90',
    postCode: 12345,
    city: 'Waakirchen'
  }
];

/**
 * Data source for the OrderWaterAnalysisTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class OrderWaterAnalysisStep2TableDataSource extends DataSource<
  OrderWaterAnalysisStep2TableItem
  > {
  data: OrderWaterAnalysisStep2TableItem[] = EXAMPLE_DATA;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<OrderWaterAnalysisStep2TableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    return observableOf(this.data);
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
