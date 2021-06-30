import { Component, OnInit, ViewChild } from '@angular/core';
import { OfferRequest } from '../../models/offerRequest';
import { OfferContact } from '../../models/offerContact';
import { OrdersService } from '../../services/orders.service';
import { OfferProperty } from '../../models/offerProperty';
import { DefaultDataService } from '../../../../shared/services/defaultData.service';
import { UtilityService } from '../../../../shared/services/utility.service';
import { OfferRequestMeterTypes } from '../../models/offerRequestMeterTypes';
@Component({
  selector: 'app-offer-request-form',
  templateUrl: './offer-request-form.component.html',
  styleUrls: ['./offer-request-form.component.scss']
})
export class OfferRequestFormComponent implements OnInit {
  serviceTypes = [{ code: 'AHCHW', text: 'Accounting (Heating Cost & Hot Water)', checked: false },
  { code: 'ACW', text: 'Accounting (Cold Water)', checked: false },
  { code: 'SAC', text: 'Settlement of Ancillary Costs', checked: false },
  { code: 'NSN', text: 'No service necessary)', checked: false }];
  meterTypes = [];
  otherTrue = false;
  @ViewChild('entryForm') entryForm;

  constructor(public orderService: OrdersService, public defaultDataService: DefaultDataService, public utilityService: UtilityService) {
    if (this.orderService.offerRequestObj == null) {
      this.orderService.offerRequestObj = new OfferRequest();
      this.orderService.offerRequestObj.contactDetails = new OfferContact();
      this.orderService.offerRequestObj.propertyAddress = new OfferProperty();
      this.orderService.offerRequestObj.meterTypes = new Array<OfferRequestMeterTypes>();
      this.orderService.offerRequestObj.serviceTypes = new Array<string>();
      this.orderService.offerRequestObj.contractType = new Array<string>();
      // this.orderService.offerRequestObj.contractType.push('-1');
      this.orderService.offerRequestObj.propertyAddress.appartmentCount = null;
      this.orderService.offerRequestObj.propertyAddress.commercialUnitCount = null;

    }
    defaultDataService.DefaultData.lookUps.measuringInstrumentType.forEach((x) => {
      this.meterTypes.push({ code: x.code, disable: true });
    });
  }

  ngOnInit(): void {
  }
  otherChange(): void {
    this.otherTrue = !this.otherTrue;
  }
  getMeterCount(measuringInstrumentType: any): number {
    if (this.orderService.offerRequestObj) {
      const meter = this.orderService.offerRequestObj.meterTypes.find(mt => mt.type === measuringInstrumentType.code);
      if (meter) {
        return meter.count;
      }
    }
    return 0;
  }
  checkMeter(measuringInstrumentType: any): boolean {
    if (this.orderService.offerRequestObj) {
      const available = this.orderService.offerRequestObj.meterTypes.findIndex(mt => mt.type === measuringInstrumentType.code);
      if (available !== -1) {
        return true;
      }
    }
    return false;
  }
  checkService(serviceType: any): boolean {
    if (this.orderService.offerRequestObj) {
      const available = this.orderService.offerRequestObj.serviceTypes.findIndex(st => st === serviceType.code);
      if (available !== -1) {
        return true;
      }
    }
    return false;
  }
  changeService(isChecked: boolean, code: string): void {
    if (isChecked) {
      if (code == 'NSN') {
        this.orderService.offerRequestObj.serviceTypes = [];
        this.serviceTypes.forEach((x) => {
          if (x.code == 'NSN') {
            x.checked = true;
          }
          else {
            x.checked = false;
          }
        });
      }
      else {
        this.serviceTypes.find(x => x.code == 'NSN').checked = false;
        this.serviceTypes.find(x => x.code == code).checked = true;
        if (this.orderService.offerRequestObj.serviceTypes.indexOf(code) == -1) {
          this.orderService.offerRequestObj.serviceTypes.push(code);
        }
      }
    }
    else {
      this.serviceTypes.find(x => x.code == code).checked = false;
      if (this.orderService.offerRequestObj.serviceTypes.indexOf(code) > -1) {
        this.orderService.offerRequestObj.serviceTypes = this.orderService.offerRequestObj.serviceTypes.filter(e => e !== code);
      }
    }
  }
  onChangeMeasuringInstrumentTypeChk(isChecked: boolean, code: string): void {
    if (isChecked) {
      this.meterTypes.find(x => x.code == code).disable = false;
      this.orderService.offerRequestObj.meterTypes.push({ type: code, count: 0 });
    }
    else {
      this.meterTypes.find(x => x.code == code).disable = true;
      this.orderService.offerRequestObj.meterTypes = this.orderService.offerRequestObj.meterTypes.filter(function(el): any { return el.type != code; });

    }
  }
  measuringInstrumentCountChange(data): void {
    if (this.orderService.offerRequestObj.meterTypes.length > 0 && this.orderService.offerRequestObj.meterTypes.filter(x => x.type == data.code).length > 0) {
      this.orderService.offerRequestObj.meterTypes.forEach((item) => {
        if (item.type == data.code) {
          item.count = data.count;
        }
      });
    }
    else {
      this.orderService.offerRequestObj.meterTypes.push({ type: data.code, count: data.count });
    }
  }
  setContractType(contract): void {
    this.orderService.offerRequestObj.contractType = new Array<string>();
    this.orderService.offerRequestObj.contractType.push(contract);
  }
}
