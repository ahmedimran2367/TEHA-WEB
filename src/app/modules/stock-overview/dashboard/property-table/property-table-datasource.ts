import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Flat } from '../../models/Flat.model';

// TODO: Replace this with your own data model type
export interface PropertyTableItem {
  id: number;
  tehaLgNo: string;
  adminLgNo: string;
  street: string;
  postcode: string;
  rwmStatus: string;
  billingStatus: string;
  readingStatus: string;
  assemblyStatus: string;
  place: string;
  billingPeriod: string;
  dta: string;
  openLetterInd: boolean;
  flats: Flat[];
}

// TODO: replace this with real data from your application

/**
 * Data source for the PropertyTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class PropertyTableDataSource extends DataSource<PropertyTableItem> {
  data: PropertyTableItem[];
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
  connect(): Observable<PropertyTableItem[]> {
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

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: PropertyTableItem[]): PropertyTableItem[] {
    // this.paginator.pageIndex * this.paginator.pageSize;
    // this.paginator.length = this.totalRecords;
    return data;
    // return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: PropertyTableItem[]): PropertyTableItem[] {
    return data;
    // if (!this.sort.active || this.sort.direction === '') {
    //   return data;
    // }

    // return data.sort((a, b) => {
    //   const isAsc = this.sort.direction === 'asc';
    //   switch (this.sort.active) {
    //     case 'accPeriod':
    //       return compare(a.billingPeriod, b.billingPeriod, isAsc);
    //     case 'tehaLgNo':
    //       return compare(+a.tehaLgNo, +b.tehaLgNo, isAsc);
    //     default:
    //       return 0;
    //   }
    // });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
// function compare(a: string | number, b: string | number, isAsc: boolean): any {
//   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
// }
