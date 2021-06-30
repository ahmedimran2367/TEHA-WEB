import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { CanComponentDeactivate } from 'src/app/core/guard/unsaved-data-guard.guard';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountingService } from '../accounting.service';

@Component({
  selector: 'app-enter-data',
  templateUrl: './enter-data.component.html',
  styleUrls: ['./enter-data.component.scss'],
})
export class EnterDataComponent implements OnInit, CanComponentDeactivate {
  selectedTabId = 0;
  options: any;
  filterOptions: any;
  autoCostConcept = '';
  costData: any;
  tab = '';
  prevTabId = 0;
  childStateChanged = { costData: false, userData: false, summary: false };
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('costDataComp') costDataComp: any;
  @ViewChild('userDataComp') userDataComp: any;
  @ViewChild('summaryDataComp') summaryDataComp: any;

  constructor(
    public route: ActivatedRoute,
    public accountingService: AccountingService,
    private defaultData: DefaultDataService,
    private dialog: MatDialog,
    public utilityService: UtilityService,
    private router: Router,
  ) {
    this.tab = 'costData';
  }

  ngOnInit(): void {
    this.accountingService.costDataSubject.subscribe((u) => {
      if (u != null) {
        this.costData = JSON.parse(JSON.stringify(u));
      }
    });

    const tabIndex = this.route.snapshot.paramMap.get('id');
    if (tabIndex != null) {
      this.selectedTabId = Number(tabIndex);
    }

    const array1 = JSON.parse(
      JSON.stringify(this.defaultData.DefaultData.lookUps.heatingCostType)
    );
    const array2 = [].concat(
      this.defaultData.DefaultData.lookUps.energyCostType,
      array1
    );
    const array3 = [].concat(
      this.defaultData.DefaultData.lookUps.houseCostType,
      array2
    );
    const array4 = [].concat(
      this.defaultData.DefaultData.lookUps.additionalHeatingCostType,
      array3
    );
    let array5 = [].concat(
      this.defaultData.DefaultData.lookUps.additionalHotWaterCostType,
      array4
    );

    const distinctResult = [];
    const map = new Map();
    for (const item of array5) {
      if (!map.has(item.code)) {
        map.set(item.code, true); // set any value to Map
        distinctResult.push(item);
      }
    }
    array5 = [...new Set(distinctResult)];
    this.options = JSON.parse(JSON.stringify(array5));
    this.filterOptions = JSON.parse(JSON.stringify(array5));
  }
  getTotalNetAmount(): any {
    let total = 0;
    if (this.costData != null) {
      if (this.costData.cost.energy != null) {
        this.costData.cost.energy.forEach((element) => {
          if (element.cost != null) {
            element.cost.forEach((x) => {
              total += Number(x.amountBrutto);
            });
          }
        });
      }
      if (this.costData.cost.heating != null) {
        this.costData.cost.heating.forEach((element) => {
          if (element.cost != null) {
            element.cost.forEach((x) => {
              total += Number(x.amountBrutto);
            });
          }
        });
      }
      if (this.costData.cost.additionalCosts[0].items != null) {
        this.costData.cost.additionalCosts[0].items.forEach((element) => {
          if (element.cost != null) {
            element.cost.forEach((x) => {
              total += Number(x.amountBrutto);
            });
          }
        });
      }
      if (this.costData.cost.hotWaterAdditional != null) {
        this.costData.cost.hotWaterAdditional.forEach((element) => {
          if (element.cost != null) {
            element.cost.forEach((x) => {
              total += Number(x.amountBrutto);
            });
          }
        });
      }
      if (this.costData.cost.heatingAdditional != null) {
        this.costData.cost.heatingAdditional.forEach((element) => {
          if (element.cost != null) {
            element.cost.forEach((x) => {
              total += Number(x.amountBrutto);
            });
          }
        });
      }
    }
    if (total > 0) {
      let fTotal = String(
        total.toFixed(2)
      ).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return fTotal;
    }
    return total;
  }
  optionSelected(conceptCode): void {
    const costConcept = this.options.filter((x) => x.code == conceptCode);
    this.autoCostConcept = costConcept[0].value;

    if (costConcept != null) {
      if (this.accountingService.actualCostData.cost.energy != null) {
        this.costData.cost.energy = [];
        this.accountingService.actualCostData.cost.energy.forEach((element) => {
          if (element.conceptCode == Number(conceptCode)) {
            this.costData.cost.energy.push(element);
          }
        });
      }
      if (this.accountingService.actualCostData.cost.heating != null) {
        this.costData.cost.heating = [];
        this.accountingService.actualCostData.cost.heating.forEach(
          (element) => {
            if (element.conceptCode == Number(conceptCode)) {
              this.costData.cost.heating.push(element);
            }
          }
        );
      }
      if (
        this.accountingService.actualCostData.cost.additionalCosts[0].items !=
        null
      ) {
        this.costData.cost.additionalCosts[0].items = [];
        this.accountingService.actualCostData.cost.additionalCosts[0].items.forEach(
          (element) => {
            if (element.conceptCode == Number(conceptCode)) {
              this.costData.cost.additionalCosts[0].items.push(element);
            }
          }
        );
      }
      if (
        this.accountingService.actualCostData.cost.hotWaterAdditional != null
      ) {
        this.costData.cost.hotWaterAdditional = [];
        this.accountingService.actualCostData.cost.hotWaterAdditional.forEach(
          (element) => {
            if (element.conceptCode == Number(conceptCode)) {
              this.costData.cost.hotWaterAdditional.push(element);
            }
          }
        );
      }
      if (
        this.accountingService.actualCostData.cost.heatingAdditional != null
      ) {
        this.costData.cost.heatingAdditional = [];
        this.accountingService.actualCostData.cost.heatingAdditional.forEach(
          (element) => {
            if (element.conceptCode == Number(conceptCode)) {
              this.costData.cost.heatingAdditional.push(element);
            }
          }
        );
      }
    }
  }
  onTextChange($event): void {
    const e = <KeyboardEvent>$event;
    if (e.key == 'Backspace') {
      this.autoCostConcept = '';
      this.filterOptions = this.options;
    }

    if ($event.target.value == '' && this.autoCostConcept == '') {
      if (this.accountingService.actualCostData.cost.energy != null) {
        this.costData.cost.energy = this.accountingService.actualCostData.cost.energy;
      }
      if (this.accountingService.actualCostData.cost.heating != null) {
        this.costData.cost.heating = this.accountingService.actualCostData.cost.heating;
      }
      if (
        this.accountingService.actualCostData.cost.additionalCosts[0].items !=
        null
      ) {
        this.costData.cost.additionalCosts[0].items = this.accountingService.actualCostData.cost.additionalCosts[0].items;
      }
      if (
        this.accountingService.actualCostData.cost.hotWaterAdditional != null
      ) {
        this.costData.cost.hotWaterAdditional = this.accountingService.actualCostData.cost.hotWaterAdditional;
      }
      if (
        this.accountingService.actualCostData.cost.heatingAdditional != null
      ) {
        this.costData.cost.heatingAdditional = this.accountingService.actualCostData.cost.heatingAdditional;
      }
    } else {
      this.filterOptions = this.options?.filter((o) =>
        o.value.toLowerCase()?.includes($event.target.value.toLowerCase())
      );
    }
  }
  openCostTab(): void {
    this.tabGroup.selectedIndex = 0;
  }

  canDeactivate(): boolean {
    if (!this.accountingService.setOwnerDataClick && (this.costDataComp.isChanged() || this.userDataComp.isChanged())) { return true; }
    else { return false; }
  }

  tabChanged($event: MatTabChangeEvent): void {
    if (this.prevTabId == 0 && this.costDataComp.isChanged()) {
      this.childStateChanged.costData = true;
      this.showTabChangeDialog($event.index);
    } else if (this.prevTabId == 1 && this.userDataComp.isChanged()) {
      this.childStateChanged.userData = true;
      this.showTabChangeDialog($event.index);
    } else {
      this.prevTabId = $event.index;
      this.selectedTabId = $event.index;
    }
  }

  showTabChangeDialog(currentId, mustCheck = false): void {
    if (this.selectedTabId !== this.prevTabId || mustCheck) {
      this.selectedTabId = this.prevTabId;
      const dialogRef = this.dialog.open(DialogComponent, {
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog

        if (result == 'confirm') {
          if (this.selectedTabId == 0) {
            this.costDataComp.discardChanges();
            this.selectedTabId = currentId;
            this.childStateChanged.costData = this.childStateChanged.userData = this.childStateChanged.summary = false;
          }
          if (this.selectedTabId == 1) {
            this.userDataComp.discardChanges();
            this.selectedTabId = currentId;
            this.childStateChanged.costData = this.childStateChanged.userData = this.childStateChanged.summary = false;
          }
          if (mustCheck) {
            this.router.navigate(['/accounting/overview/review']);
          }
        }
      });
    }
  }
  replaceCommaToDecimal(value) {
    if (value != null) {
      return this.utilityService.germanDecimalToActual(value);
    }
    else {
      return value;
    }
  }
  arrowBack() {
    if (this.accountingService.summaryStepper == 2) {
      this.selectedTabId=2;
      this.accountingService.summaryStepper=1;
      this.summaryDataComp.changeStepper(1);
    }
    else {
      if (this.accountingService.property.billingStatus == 'WAIT_DATA' &&
        this.accountingService.property.dta == 'N') {
        if (this.prevTabId == 0 && this.costDataComp.isChanged()) {
          this.childStateChanged.costData = true;
          this.showTabChangeDialog(this.selectedTabId, true);
        } else if (this.prevTabId == 1 && this.userDataComp.isChanged()) {
          this.childStateChanged.userData = true;
          this.showTabChangeDialog(this.selectedTabId, true);
        }
        else {
          this.router.navigate(['/accounting/overview/review']);
        }
      }
      else {
        this.router.navigate(['/accounting/overview/review']);
      }
    }
  }
}
