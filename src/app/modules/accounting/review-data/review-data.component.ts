import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountingService } from '../accounting.service';

export interface dataElement {
  mngr: string;
  addr: string;
  period: string;
  status: string;
}

const accounting_data: dataElement[] = [
  {
    mngr: 'name',
    addr: 'abc',
    period: '',
    status: '',
  },
];

@Component({
  selector: 'app-review-data',
  templateUrl: './review-data.component.html',
  styleUrls: ['./review-data.component.scss'],
})
export class ReviewDataComponent implements OnInit {
  displayedColumns: string[] = ['mngr', 'addr', 'period', 'status'];
  dataSource = accounting_data;
  lastUpdatedDates: any;
  url = '';
  urll: SafeResourceUrl;
  constructor(
    public accountingService: AccountingService,
    private authenticationService: AuthenticationService,
    public utilityService: UtilityService,
    public defaultDataService: DefaultDataService,
    private sanitizer: DomSanitizer
  ) {
    this.authenticationService.currentUser.subscribe((U) => {
      accounting_data.pop();
      accounting_data.push({
        mngr: U?.name,
        addr: `${accountingService.property.street}, ${accountingService.property.place}, ${accountingService.property.postcode}`,
        period: accountingService.property.billingPeriod.toString(),
        status: accountingService.property.billingStatus.toString(),
      });
    });
    this.accountingService.getLastUpdatedDates().subscribe((m) => {
      this.lastUpdatedDates = m.data;
      if (m.data != null) {
        if (
          m.data.costLastUpdatedDate != null ||
          this.accountingService.lastPayrollYearId == 0
        ) {
          this.accountingService.costDataFirstAttemptInd = false;
        } else {
          this.accountingService.costDataFirstAttemptInd = true;
        }

        if (
          m.data.userLastUpdatedDate != null ||
          this.accountingService.lastPayrollYearId == 0
        ) {
          this.accountingService.userDataFirstAttemptInd = false;
        } else {
          this.accountingService.userDataFirstAttemptInd = true;
        }
      }
    });
    this.url = this.defaultDataService.DefaultData.systemSettings.dataExchangeUrl;
    // this.url = `http://onlineservices.teha-wd.de:652/ishaca/loginDataExchange.do?userId=${this.user.id}&propertyId=${this.browserService.getlocalStorage('currentPropertyId')}`;
  }

  ngOnInit(): void { }
  onDataExchange() {
    // /accounting/overview/dataExchange
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
      window.open(this.url + "?userId=" + this.accountingService.user.id + "&propertyId=" + this.accountingService.property.id + "&token=" + currentUser.externalToken, "_blank");
    }
  }
}
