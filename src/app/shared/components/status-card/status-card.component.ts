import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountingService } from 'src/app/modules/accounting/accounting.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss']
})
export class StatusCardComponent implements OnInit {
  accountingStatusComments: '';
  constructor(public accountingService: AccountingService, public utilityService: UtilityService, private translate: TranslateService,) { }

  ngOnInit(): void {
    let accountingBeenProcessed;
    let accountingInProgress;
    let accountingNotStarted;
    let canEnterData;
    this.translate
      .get([
        'accounting.accountingBeenProcessed',
        'accounting.accountingInProgress',
        'accounting.accountingNotStarted',
        'accounting.canEnterData',
      ])
      .subscribe((values) => {
        accountingBeenProcessed = values['accounting.accountingBeenProcessed'];
        accountingInProgress = values['accounting.accountingInProgress'];
        accountingNotStarted = values['accounting.accountingNotStarted'];
        canEnterData = values['accounting.canEnterData'];
      });
    if (this.accountingService.property != null) {
      if (this.accountingService.property.billingStatus == "FINISH" || this.accountingService.property.billingStatus == "DOWNLOADED") {
        this.accountingStatusComments = accountingBeenProcessed;
      }
      else if (this.accountingService.property.billingStatus == "IN_PREPARATION") {
        this.accountingStatusComments = accountingInProgress;
      }
      else if (this.accountingService.property.billingStatus == "NOT_STARTED") {
        this.accountingStatusComments = accountingNotStarted;
      }
      else if (this.accountingService.property.billingStatus == "WAIT_DATA") {
        this.accountingStatusComments = canEnterData;
      }
    }
  }

}
