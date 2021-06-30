import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingService } from '../accounting.service';
import { FlatData, RentalInformation } from '../model/flatData';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';
import { StockOverviewService } from '../../stock-overview/stock-overview.service';
import { CurrencyMaskInputMode } from 'ngx-currency';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
})
export class UserDataComponent implements OnInit {
  flatData: FlatData;
  @ViewChild('userDataForm') userDataForm;
  readonlyInd = false;
  addNewUserTooltip = '';
  deleteTooltip = '';
  accountingSaveErrorMessage= '';
  inputOptions = { nullable:true,align:'center',prefix: '', thousands: '.', decimal: ',', inputMode: CurrencyMaskInputMode.NATURAL };
  constructor(
    private accountingService: AccountingService,
    private router: Router,
    private toast: ToastService,
    public utility: UtilityService,
    private browserService: BrowserStorageService,
    private translate: TranslateService,
    private stockOverviewService: StockOverviewService
  ) {
    this.translate
      .get('accounting.addNewUserTooltip')
      .subscribe((value) => {
        this.addNewUserTooltip = value;
      });
    this.translate
      .get('accounting.clearTooltip')
      .subscribe((value) => {
        this.deleteTooltip = value;
      });
      this.translate
      .get('accounting.accountingSaveErrorMessage')
      .subscribe((value) => {
        this.accountingSaveErrorMessage = value;
      });
  }

  ngOnInit(): void {
    if (this.accountingService.flatData != null && this.accountingService.savedEnterInterimInd == false) {
      this.flatData = this.accountingService.flatData;
      this.readonlyIndCheck();
      if (this.accountingService.originalFlatData == null) {
        this.accountingService.originalFlatData = JSON.parse(
          JSON.stringify(this.flatData)
        );
      }
    } else {
      let payrollYearID;
      // if (this.accountingService.userDataFirstAttemptInd == true) {
      //   payrollYearID = this.accountingService.lastPayrollYearId;
      // } else {
      payrollYearID = this.accountingService.property.billingPeroidId;
      // }
      this.accountingService.getFlatUsers(payrollYearID).subscribe((res) => {
        this.accountingService.savedEnterInterimInd = false;
        this.flatData = res.data;
        // if (this.accountingService.userDataFirstAttemptInd == true) {
        //   this.flatData.confirmTheCompletenessInd = false;                    
        // }
        this.readonlyIndCheck();
        this.pushRentalsInEmptyFlat();
        this.accountingService.flatData = this.flatData;
        this.accountingService.originalFlatData = JSON.parse(
          JSON.stringify(this.flatData)
        );
      });
    }
  }
  readonlyIndCheck() {
    this.readonlyInd =
          this.accountingService.property.billingStatus == 'WAIT_DATA' &&
            this.accountingService.property.dta == 'N' &&
            !this.flatData.confirmTheCompletenessInd
            ? false
            : true;
  }

  addNewRow(i): void {
    this.flatData.flatUser[i].rentals.push(
      new RentalInformation(
        this.flatData.flatUser[i].flatId,
        this.flatData.flatUser[i].adminUserNo,
        this.flatData.flatUser[i].tehaUserNo,
        this.flatData.flatUser[i].rentals[this.flatData.flatUser[i].rentals.length - 1].hotWaterArea,
        this.flatData.flatUser[i].rentals[this.flatData.flatUser[i].rentals.length - 1].heatingArea
      )
    );
    this.flatData.flatUser[i]['showRow'] = true;
  }
  deleteRow(i, x): void {
    this.flatData.flatUser[i].rentals.splice(x, 1);
    if (this.flatData.flatUser[i].rentals.length == 0) {
      this.pushRentalsInEmptyFlat();      
    }
  }
  editNameChange(i, x): void {
    this.flatData.flatUser[i].rentals[
      x
    ].nameChange.newName = this.flatData.flatUser[i].rentals[x].nameChange.name;
    this.flatData.flatUser[i].rentals[x].nameChange.userChangedInd = true;
    this.translate
      .get('accounting.userEdited')
      .subscribe((value) => {
        this.toast.openSnackInfo(value)
      });

  }

  setOwnerData(flatID): void {
    this.accountingService.setOwnerDataClick=true;
    this.router.navigate(['/accounting/overview/owner/' + flatID], {
      skipLocationChange: true,
    });
  }

  getInputError(name, i, x): any {
    if (this.userDataForm) {
      if (this.userDataForm.form.controls[name + i + x] == undefined) {
        return false;
      }
      if (this.userDataForm.form.controls[name + i + x].status == 'DISABLED') {
        return false;
      }
      return !this.userDataForm.form.controls[name + i + x]?.valid;
    } else {
      return false;
    }
  }
  navigateEnterInterimReading(flatId, i, x): void {
    this.browserService.setSessionStorage('userDataurlInd', true);
    if (this.flatData.flatUser[i].rentals[x].allMoveOutReadingsInd == true) {
      this.browserService.setSessionStorage('allMoveOutReadingsInd', true);
    }
    this.accountingService.userDataSelectedMoveOutDate = this.flatData.flatUser[i].rentals[x].moveOutDate;
    this.stockOverviewService.getFlats(this.browserService.getlocalStorage('currentPropertyId'), flatId, false).subscribe(data => {
      this.stockOverviewService.flatData = data.data.items;
      this.stockOverviewService.flatId = flatId;
      this.accountingService.originalFlatData = JSON.parse(
        JSON.stringify(this.flatData)
      );
      this.router.navigate(['/orders/enterintermreading/' + flatId], {
        skipLocationChange: true,
      });
    });
  }
  saveAndContinue(): any {
    this.accountingService.noOfUserChanges = this.accountingService.getNoofUserChanges();
    this.flatData.payrollYearId = this.accountingService.property.billingPeroidId;
    this.flatData.updatedDate = null;
    this.accountingService.saveFlatUsers().subscribe(
      (res) => {
        this.flatData = res.data;
        this.readonlyInd =
          this.accountingService.property.billingStatus == 'WAIT_DATA' &&
            this.accountingService.property.dta == 'N' &&
            !this.flatData.confirmTheCompletenessInd
            ? false
            : true;
        this.pushRentalsInEmptyFlat();
        this.accountingService.flatData = this.flatData;
        this.accountingService.originalFlatData = JSON.parse(
          JSON.stringify(this.flatData)
        );
        this.translate
          .get('accounting.successfullySaved')
          .subscribe((value) => {
            this.toast.openSnackSuccessfully(value);
          });
      },
      (err) => {
        this.toast.openSnackError(this.accountingSaveErrorMessage);
      }
    );
  }
  cancelNameChange(i, x): void {
    if (!isNullOrUndefined(this.flatData.flatUser[i].rentals[x].nameChange.name)) {
      this.flatData.flatUser[i].rentals[x].nameChange.newName = null;
      this.flatData.flatUser[i].rentals[x].nameChange.userChangedInd = false;
    }
  }
  isChanged(): boolean {
    if (
      JSON.stringify(this.flatData) !==
      JSON.stringify(this.accountingService.originalFlatData)
    ) {
      return true;
    }
    return false;
  }
  discardChanges(): void {
    this.flatData = JSON.parse(
      JSON.stringify(this.accountingService.originalFlatData)
    );
    this.accountingService.flatData = this.flatData;
  }
  pushRentalsInEmptyFlat(): void {
    this.flatData.flatUser.forEach((element, i) => {
      if (element.rentals.length > 1) {
        this.flatData.flatUser[i]['showRow'] = true;
      }
      if (element.rentals.length == 0) {
        element.rentals.push(
          new RentalInformation(
            element.flatId,
            element.adminUserNo,
            element.tehaUserNo,
            null,
            null
          )
        );
        element.rentals[0].flatEmptyInd = true;
        element.rentals[0].numberOfpeople = 0;
        element.rentals[0].hotWaterArea = 0;
        element.rentals[0].heatingArea = 0;
        element.rentals[0].moveInDate = this.accountingService.currentBillingPeroid.from;
        element.rentals[0].moveOutDate = this.accountingService.currentBillingPeroid.to;
      }
    });
  }
  oneDayAdd(date: any): any {
    if (date == null || date == undefined) {
      return null;
    }
    const current = new Date(date);
    current.setDate(current.getDate() + 1);
    return this.utility.setDateFormat(current);
  }
  onVacantClick(value, i, x) {
    this.flatData.flatUser[i].rentals[x].flatEmptyInd = value;
    if (value == true) {
      this.flatData.flatUser[i].rentals[x].nameChange.newName = null;
      this.flatData.flatUser[i].rentals[x].nameChange.userChangedInd = false;
      this.flatData.flatUser[i].rentals[x].advancePayment = 0;
      this.flatData.flatUser[i].rentals[x].numberOfpeople = 0;
      this.flatData.flatUser[i].rentals[x].hotWaterArea = 0;
      this.flatData.flatUser[i].rentals[x].heatingArea = 0;
    }
    else {
      this.flatData.flatUser[i].rentals[x].nameChange.userChangedInd = true;
    }
  }
  trackByIdx(index: number, obj: any): any {
    return index;
  }
  setNumberOfPeople(val, i, x) {
    if (!isNullOrUndefined(val)) {
      this.flatData.flatUser[i].rentals[x].numberOfpeople = Number(val);
    }
    else
      this.flatData.flatUser[i].rentals[x].numberOfpeople = val;
  }
  GetRentalSeq(n) {
    var len = 3 - (''+n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
  }
}
