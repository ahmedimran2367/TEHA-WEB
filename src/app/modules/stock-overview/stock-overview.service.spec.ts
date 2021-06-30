/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { StockOverviewService } from './stock-overview.service';

describe('Service: StockOverview', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockOverviewService]
    });
  });

  it('should ...', inject([StockOverviewService], (service: StockOverviewService) => {
    expect(service).toBeTruthy();
  }));
});
