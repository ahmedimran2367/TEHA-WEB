import { Component, OnInit } from '@angular/core';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrdersService } from '../../services/orders.service';
@Component({
  selector: 'app-offer-request-form-summary',
  templateUrl: './offer-request-form-summary.component.html',
  styleUrls: ['./offer-request-form-summary.component.scss']
})
export class OfferRequestFormSummaryComponent implements OnInit {

  serviceTypes = [{ code: 'AHCHW', text: 'Accounting (Heating Cost & Hot Water)', checked: true },
  { code: 'ACW', text: 'Accounting (Cold Water)', checked: true },
  { code: 'SAC', text: 'Settlement of Ancillary Costs', checked: true },
  { code: 'NSN', text: 'No service necessary)', checked: true }];
  meterTypes = [];
  otherTrue = false;
  constructor(public orderService: OrdersService, public defaultDataService: DefaultDataService, public utilityService: UtilityService) {
    defaultDataService.DefaultData.lookUps.measuringInstrumentType.forEach((x) => {
      this.meterTypes.push({ code: x.code, disable: true });
    });
  }

  ngOnInit(): void {
  }
}
