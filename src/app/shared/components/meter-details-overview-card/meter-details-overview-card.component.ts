import { Component, Input, OnInit } from '@angular/core';
import { StockOverviewService } from 'src/app/modules/stock-overview/stock-overview.service';
import { BrowserStorageService } from '../../services/browser-storage/browser-storage.service';
import { DefaultDataService } from '../../services/defaultData.service';

@Component({
  selector: 'app-meter-details-overview-card',
  templateUrl: './meter-details-overview-card.component.html',
  styleUrls: ['./meter-details-overview-card.component.scss'],
})
export class MeterDetailsOverviewCardComponent implements OnInit {
  @Input('title') title = 'Mr.';
  @Input('firstName') firstName = 'John';
  @Input('lastname') lastname = 'Doe';
  @Input('buildingname') buildingname = 'Woldowstr. 90';
  @Input('street') street = 'Freistaat Beyern';
  @Input('city') city = 'Waakirchen';
  @Input('zipcode') zipcode = '83662';
  @Input('adminNo') adminUserNo = '001992';
  @Input('tehaUserNo') tehaUserNo = '88769';
  @Input('serialNumber') serialNumber = '88769';
  meterType: string;
  @Input() meterId: number;
  constructor(
    private defaultData: DefaultDataService,
    private browserService: BrowserStorageService,
    private stockOverviewService: StockOverviewService
  ) {}

  ngOnInit(): void {
    this.updateCard(this.meterId);
  }

  updateCard(meterId: number): void {
   // this.firstName = this.stockOverviewService.user.name.split(' ')[0];
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
    const meter = this.stockOverviewService.meterData?.find(
      (m) => m.id === meterId
    );
    if (meter) {
      // this.adminUserNo = meter.adminUserNo;
      // this.tehaUserNo = meter.tehaUserNo;
      this.serialNumber = meter.serialNumber;
      this.meterType = this.defaultData.DefaultData.lookUps.measuringInstrumentType.find(
        (mt) => mt.value === meter.meterTypeDesc
      ).code;
    }
  }
}
