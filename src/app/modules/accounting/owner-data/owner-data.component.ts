import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountingService } from '../accounting.service';
import { OwnerInformation } from '../model/flatData';

@Component({
  selector: 'app-owner-data',
  templateUrl: './owner-data.component.html',
  styleUrls: ['./owner-data.component.scss'],
})
export class OwnerDataComponent implements OnInit {
  owners: OwnerInformation[] = [];
  origOwners: OwnerInformation[] = [];
  readonlyInd = false;
  flatId: number;
  addNewUserTooltip = '';
  deleteTooltip = '';
  @ViewChild('ownerForm') ownerForm;

  constructor(
    private accountingService: AccountingService,
    public route: ActivatedRoute,
    public utility: UtilityService,
    private translate: TranslateService,
    public defaultDataService: DefaultDataService,
    private router: Router,
    private dialog: MatDialog,
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
  }

  ngOnInit(): void {
    if(this.accountingService.setOwnerDataClick){this.accountingService.setOwnerDataClick=false;}
    this.readonlyInd =
      this.accountingService.property.billingStatus == 'WAIT_DATA' &&
        this.accountingService.property.dta == 'N' &&
        !this.accountingService.flatData.confirmTheCompletenessInd
        ? false
        : true;
    const flatId = this.route.snapshot.paramMap.get('id');
    this.flatId = this.accountingService.flatData.flatUser.find(
      (x) => x.flatId == Number(flatId)
    ).flatId;
    this.owners = JSON.parse(JSON.stringify(this.accountingService.flatData.flatUser.find(
      (x) => x.flatId == Number(flatId)
    ).owners));
    if (this.owners.length == 0) {
      this.owners.push(
        new OwnerInformation(
          this.accountingService.flatData.propertyId,
          this.flatId,
          this.accountingService.flatData.payrollYearId
        )
      );
    }
    this.origOwners=JSON.parse(JSON.stringify(this.owners));
  }
  deleteRow(i): void {
    this.owners.splice(i, 1);
    if (this.owners.length < 1) {
      this.owners.push(
        new OwnerInformation(
          this.accountingService.flatData.propertyId,
          this.flatId,
          this.accountingService.flatData.payrollYearId
        )
      );
    }
  }
  addNewRow(i): void {
    this.owners.push(
      new OwnerInformation(
        this.accountingService.flatData.propertyId,
        this.flatId,
        this.accountingService.flatData.payrollYearId
      )
    );
  }
  oneDayAdd(date: any): any {
    if (date == null || date == undefined) {
      return this.accountingService.currentBillingPeroid.from;
    }
    const current = new Date(date);
    current.setDate(current.getDate() + 1);
    return this.utility.setDateFormat(current);
  }
  trackByIdx(index: number, obj: any): any {
    return index;
  }
  goBackToUserData(saveInd) {
    if (saveInd) {
      this.owners = this.owners.filter(x => x.contact.firstName != null && x.contact.lastName != null && x.startDate != null);
      this.accountingService.flatData.flatUser.find((x) => x.flatId == Number(this.flatId)).owners = this.owners;
      this.accountingService.originalFlatData = JSON.parse(
        JSON.stringify(this.accountingService.flatData)
        );
        this.router.navigate(['/accounting/overview/enter/1'], {
          skipLocationChange: true,
        });
    }
    else{
      if(JSON.stringify(this.origOwners)!=JSON.stringify(this.owners)){
        this.showTabChangeDialog();
      }
      else{
        this.router.navigate(['/accounting/overview/enter/1'], {
          skipLocationChange: true,
        });
      }
    }

}
showTabChangeDialog(): void {

    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog

      if (result == 'confirm') {
        this.router.navigate(['/accounting/overview/enter/1'], {
          skipLocationChange: true,
        });
      }
    });
}    
getInputError(name, i): any {
  if (this.ownerForm) {
    if (this.ownerForm.form.controls[name + i] == undefined) {
      return false;
    }
    if (this.ownerForm.form.controls[name + i].status == 'DISABLED') {
      return false;
    }
    return !this.ownerForm.form.controls[name + i]?.valid;
  } else {
    return false;
  }
}
}
