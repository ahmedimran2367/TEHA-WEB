import { DataSource } from '@angular/cdk/collections';
import { Observable, of as observableOf } from 'rxjs';

// TODO: Replace this with your own data model type
export interface OrderWaterAnalysisStep1TableItem {
  tehalgnumber: number;
  adminlgnumber: number;
  street: string;
  postcode: string;
  city: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: OrderWaterAnalysisStep1TableItem[] = [
  {
    tehalgnumber: 24232,
    adminlgnumber: 88726,
    street: 'Lahore',
    postcode: '83662',
    city: 'Stutgat'
  },
  {
    tehalgnumber: 24232,
    adminlgnumber: 88726,
    street: 'Lahore',
    postcode: '83662',
    city: 'Stutgat'
  },
  {
    tehalgnumber: 24232,
    adminlgnumber: 88726,
    street: 'Lahore',
    postcode: '83662',
    city: 'Stutgat'
  },
  {
    tehalgnumber: 24232,
    adminlgnumber: 88726,
    street: 'Lahore',
    postcode: '83662',
    city: 'Stutgat'
  },
  {
    tehalgnumber: 24232,
    adminlgnumber: 88726,
    street: 'Lahore',
    postcode: '83662',
    city: 'Stutgat'
  },
  {
    tehalgnumber: 24232,
    adminlgnumber: 88726,
    street: 'Lahore',
    postcode: '83662',
    city: 'Stutgat'
  },
  {
    tehalgnumber: 24232,
    adminlgnumber: 88726,
    street: 'Lahore',
    postcode: '83662',
    city: 'Stutgat'
  },
  {
    tehalgnumber: 24232,
    adminlgnumber: 88726,
    street: 'Lahore',
    postcode: '83662',
    city: 'Stutgat'
  },
  {
    tehalgnumber: 24232,
    adminlgnumber: 88726,
    street: 'Lahore',
    postcode: '83662',
    city: 'Stutgat'
  }
];

/**
 * Data source for the OrderWaterAnalysisTable1 view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class OrderWaterAnalysisStep1TableDataSource extends DataSource<OrderWaterAnalysisStep1TableItem> {
  data: OrderWaterAnalysisStep1TableItem[] = EXAMPLE_DATA;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<OrderWaterAnalysisStep1TableItem[]> {
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

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
