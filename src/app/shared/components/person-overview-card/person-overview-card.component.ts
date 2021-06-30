import { Component, Input, OnInit } from '@angular/core';
import { StockOverviewService } from 'src/app/modules/stock-overview/stock-overview.service';
import { BrowserStorageService } from '../../services/browser-storage/browser-storage.service';

@Component({
  selector: 'app-person-overview-card',
  templateUrl: './person-overview-card.component.html',
  styleUrls: ['./person-overview-card.component.scss']
})
export class PersonOverviewCardComponent implements OnInit {
  @Input('title') title = 'Mr.';
  @Input('firstName') firstName = 'John';
  @Input('lastname') lastname = 'Doe';
  @Input('buildingname') buildingname = 'Woldowstr. 90';
  @Input('street') street = 'Freistaat Beyern';
  @Input('city') city = 'Waakirchen';
  @Input('zipcode') zipcode = '83662';
  @Input('adminNo') adminUserNo = '001992';
  @Input('tehaUserNo') tehaUserNo = '88769';
  constructor(
    private browserService: BrowserStorageService,
    private stockOverviewService: StockOverviewService
  ) {}

  ngOnInit(): void {
    const properties = this.browserService.getSessionStorage('userProperties');
    const building = properties?.find(
      (p) => p.id === this.browserService.getlocalStorage('currentPropertyId')
    );

    this.street = building?.street;
    this.city = building?.place;
    this.zipcode = building?.postcode;
    const flat = this.stockOverviewService.flatData?.find(
      (f) => f.id === this.stockOverviewService.flatId
    );
    if (flat) {
      this.firstName = flat.tenantName;
      this.adminUserNo = flat.adminUserNo;
      this.tehaUserNo = flat.tehaUserNo;
    }
  }

}
