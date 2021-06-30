import { DataSource } from '@angular/cdk/collections';
import { Observable, of as observableOf } from 'rxjs';

// TODO: Replace this with your own data model type
export interface ConsumptionOfThermalEnergyTableItem {
  period: string;
  amount: string;
  unit: string;
  vacanyPercentage: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: ConsumptionOfThermalEnergyTableItem[] = [
  {
    period: 'Hello',
    amount: 'Hello',
    unit: 'Hello',
    vacanyPercentage: 'Hello'
  },
  {
    period: 'Hello',
    amount: 'Hello',
    unit: 'Hello',
    vacanyPercentage: 'Hello'
  },
  {
    period: 'Hello',
    amount: 'Hello',
    unit: 'Hello',
    vacanyPercentage: 'Hello'
  },
  {
    period: 'Hello',
    amount: 'Hello',
    unit: 'Hello',
    vacanyPercentage: 'Hello'
  }
];

/**
 * Data source for the ConsumptionOfThermalEnergyTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ConsumptionOfThermalEnergyTableDataSource extends DataSource<ConsumptionOfThermalEnergyTableItem> {
  data: ConsumptionOfThermalEnergyTableItem[] = EXAMPLE_DATA;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ConsumptionOfThermalEnergyTableItem[]> {
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
