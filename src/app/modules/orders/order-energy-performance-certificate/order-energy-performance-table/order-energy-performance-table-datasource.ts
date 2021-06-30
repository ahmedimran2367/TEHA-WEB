import { DataSource } from '@angular/cdk/collections';
import { Observable, of as observableOf } from 'rxjs';

// TODO: Replace this with your own data model type
export interface OrderEnergyPerformanceTableItem {
  tehaUserno: number;
  adminUserno: number;
  street: string;
  postCode: string;
  city: string;
  status: string;
  issuanceDate: string;
  exhibitionDate: string;
  download: string;
  isDownloadEnabled: boolean;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: OrderEnergyPerformanceTableItem[] = [
  {
    tehaUserno: 123,
    adminUserno: 123,
    street: '123',
    postCode: '123',
    city: '123',
    status: '123',
    issuanceDate: '123',
    exhibitionDate: '123',
    download: '123',
    isDownloadEnabled: true
  },
  {
    tehaUserno: 123,
    adminUserno: 123,
    street: '123',
    postCode: '123',
    city: '123',
    status: '123',
    issuanceDate: '123',
    exhibitionDate: '123',
    download: '123',
    isDownloadEnabled: false
  }, {
    tehaUserno: 123,
    adminUserno: 123,
    street: '123',
    postCode: '123',
    city: '123',
    status: '123',
    issuanceDate: '123',
    exhibitionDate: '123',
    download: '123',
    isDownloadEnabled: true
  }
];

/**
 * Data source for the OrderEnergyPerformanceTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class OrderEnergyPerformanceTableDataSource extends DataSource<OrderEnergyPerformanceTableItem> {
  data: OrderEnergyPerformanceTableItem[] = EXAMPLE_DATA;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<OrderEnergyPerformanceTableItem[]> {
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
