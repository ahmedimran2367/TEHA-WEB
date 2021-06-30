import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Order } from '../../models/order';

/**
 * Data source for the OrderTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class OrderTableDataSource extends DataSource<Order> {
  data: Order[];
  paginator: MatPaginator;
  sort: MatSort;
  totalRecords: number;

  constructor(data: any) {
    super();
    if (data) {
      this.data = data.items;
      this.totalRecords = data.totalRecords;
    } else {
      this.data = [];
      this.totalRecords = 0;
    }
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Order[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange,
    ];

    return merge(...dataMutations).pipe(
      map(() => {
        if (this.data) {
          return this.getPagedData(this.getSortedData([...this.data]));
        }
        return this.data;
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): any {}

  private getPagedData(data: Order[]): Order[] {
    // this.paginator.pageIndex * this.paginator.pageSize;
    // this.paginator.length = this.totalRecords;
    return data;
    // return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Order[]): Order[] {
    return data;

  }
}

