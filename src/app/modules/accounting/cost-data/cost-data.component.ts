import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import {CurrencyMaskInputMode} from 'ngx-currency'
import {
  CostData,
  CostDetail,
  CostConcept,
  FileContentResponse,
} from '../model/costData';
import { AccountingService } from '../accounting.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ConsumptionOfThermalEnergyTableComponent } from '../../orders/order-energy-performance-certificate/consumption-of-thermal-energy-table/consumption-of-thermal-energy-table.component';
import { EnergyCostQuantity } from '../model/costData';
import { UtilityService } from '../../../shared/services/utility.service';

export interface dataElement {
  concept: string;
  unit: string;
  consumption: string;
  amount: string;
  vat: string;
  net: string;
  date: string;
  last: string;
  invoice: string;
}

const accounting_data: dataElement[] = [
  {
    concept: 'Natural Gas Tank',
    unit: '',
    consumption: '',
    amount: '',
    vat: '',
    net: '',
    date: '',
    last: '',
    invoice: '',
  },
];

@Component({
  selector: 'app-cost-data',
  templateUrl: './cost-data.component.html',
  styleUrls: ['./cost-data.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CostDataComponent implements OnInit {
  showRow = true;
  rowArr = Array;
  numRow: number = 0;
  displayedColumns: string[] = [
    'btn',
    'concept',
    'unit',
    'consumption',
    'amount',
    'vat',
    'net',
    'date',
    'last',
    'invoice',
    'add',
  ];
  hideColumns: string[] = [
    'concept',
    'unit',
    'consumption',
    'amount',
    'vat',
    'net',
    'date',
    'last',
    'invoice',
    'add',
  ];
  dataSource = new MatTableDataSource(accounting_data);
  newRow = {
    concept: '',
    unit: '',
    consumption: '',
    amount: '',
    vat: '',
    net: '',
    date: '',
    last: '',
    invoice: '',
  };
  attachmenttooltipText = '';
  deleteTooltip = '';
  addTooltip = '';
  yourComment = '';
  accountingValidationErrorMessage = '';
  costType: string = '';
  costData: CostData;
  accPeriod: string;
  dateTimeWarning = [8, 194, 193, 153, 133, 134, 135, 151];
  liquidGasConceptCodes = [8, 151, 153];
  OilPalletsConceptCodes = [111, 122, 123, 124];
  canMultipleCostConcept = [242, 70, 923];
  readonlyInd: boolean = false;
  von = '';
  wageShareType = [];
  calculationKeys = [];
  expensionOpen = [
    { type: 'energy', open: false },
    { type: 'heating', open: false },
    { type: 'heatingAdditional', open: false },
    { type: 'hotWaterAdditional', open: false },
    { type: 'additionalCosts', open: false },
  ];
  @ViewChild('costDataForm') costDataForm;
  toolTipText: string = '';
  costDataOriginal: CostData;
  @Input() options: any;
  @ViewChild('energyWarningDate') energyWarningDate: TemplateRef<any>;
  @ViewChild('energyWarningConsunption') energyWarningConsunption: TemplateRef<any>;
  @ViewChild('energyWarningBoth') energyWarningBoth: TemplateRef<any>;
  costCategory = [
    { type: 'energy', isError: false },
    { type: 'heating', isError: false },
    { type: 'heatingAdditional', isError: false },
    { type: 'hotWaterAdditional', isError: false },
    { type: 'additionalCosts', isError: false },
  ];
  accountingSaveErrorMessage = '';
  inputOptions = { nullable:true,align:'center',prefix: '', thousands: '.', decimal: ',', inputMode: CurrencyMaskInputMode.NATURAL };
  constructor(
    private defaultDataService: DefaultDataService,
    private accountingService: AccountingService,
    private router: Router,
    private toast: ToastService,
    private toastService: ToastService,
    private translate: TranslateService,
    public utility: UtilityService
  ) {
    this.accPeriod = this.accountingService.property.billingPeriod;
    this.translate
      .get([
        'accounting.attachmentTooltip',
        'accounting.addInvoiceTooltip',
        'accounting.clearTooltip',
        'accounting.yourComment',
        'accounting.von',
        'accounting.accountingSaveErrorMessage',
        'accounting.errorExists',
      ])
      .subscribe((values) => {
        this.attachmenttooltipText = values['accounting.attachmentTooltip'];
        this.addTooltip = values['accounting.addInvoiceTooltip'];
        this.deleteTooltip = values['accounting.clearTooltip'];
        this.yourComment = values['accounting.yourComment'];
        this.von = values['accounting.von'];
        this.accountingSaveErrorMessage = values['accounting.accountingSaveErrorMessage'];
        this.accountingValidationErrorMessage = values['accounting.errorExists'];
      });

    this.wageShareType = JSON.parse(
      JSON.stringify(this.defaultDataService.DefaultData.lookUps.wageShareType)
    );
    this.calculationKeys = JSON.parse(
      JSON.stringify(this.defaultDataService.DefaultData.lookUps.calculationKey)
    );
  }

  ngOnInit(): void {
    this.accountingService.costDataSubject.subscribe((u) => {
      if (u != null) {
        this.costData = u;
      }
    });
    if (this.costData != null) {
      this.accountingService.actualCostData = JSON.parse(
        JSON.stringify(this.costData)
      );
      this.costDataOriginal = JSON.parse(JSON.stringify(this.costData));
      this.readonlyInd =
        this.accountingService.property.billingStatus == 'WAIT_DATA' &&
          this.accountingService.property.dta == 'N' &&
          !this.costData.confirmTheCompletenessInd
          ? false
          : true;
    } else {
      this.getCostAPI();
    }
  }
  getCostAPI(): any {
    this.accountingService
      .getCostData(this.accountingService.property.billingPeroidId)
      .subscribe(
        (res) => {
          this.costData = res.data;
          this.accountingService.costDataSubject.next(this.costData);
          this.accountingService.actualCostData = JSON.parse(
            JSON.stringify(this.costData)
          );
          if (this.costData != null) {
            this.costDataInitialSettings();
          }
          this.costDataOriginal = JSON.parse(JSON.stringify(this.costData));
          this.readonlyInd =
            this.accountingService.property.billingStatus == 'WAIT_DATA' &&
              this.accountingService.property.dta == 'N' &&
              !this.costData.confirmTheCompletenessInd
              ? false
              : true;
        },
        (error) => {
          this.translate
            .get('miscellaneous.couldNotCostData')
            .subscribe((value) => {
              this.toastService.openSnackError(value);
            });
        }
      );
  }

  addNewCostConcept(type): any {
    let lastId = -1;
    if (this.costData != null) {
      if (type == 'additionalCosts') {
        if (
          this.costData.cost[type] != null &&
          this.costData.cost[type][0] != null
        ) {
          if (this.costData.cost[type][0].items == null) {
            this.costData.cost[type][0].items = [];
          }
          if (
            this.costData.cost[type][0].items.filter((x) => x.conceptId < 1)
              .length > 0
          ) {
            let id = Math.min.apply(
              Math,
              this.costData.cost[type][0].items.map(function (o) {
                return o.conceptId;
              })
            );
            lastId = --id;
          }
          this.costData.cost[type][0].items.push(
            this.getCostConceptObj(lastId)
          );
        }
      } else {
        if (this.costData.cost[type] == null) {
          this.costData.cost[type] = [];
        }
        if (
          this.costData.cost[type].filter((x) => x.conceptId < 1).length > 0
        ) {
          let id = Math.min.apply(
            Math,
            this.costData.cost[type].map(function (o) {
              return o.conceptId;
            })
          );
          lastId = --id;
        }
        this.costData.cost[type].push(this.getCostConceptObj(lastId));
      }
    }
  }

  deleteCost(type: string, costConceptCode: number, id: number, index: number, conceptId: number): any {
    if (this.costData != null) {
      // if (id && id > 0) {
      //   this.accountingService.deleteCost(id).subscribe(
      //     (res) => {
      //       this.translate
      //         .get('accounting.costDeletedSuccessfully')
      //         .subscribe((value) => {
      //           this.toastService.openSnackSuccessfully(value);
      //         });
      //     },
      //     (error) => {
      //       if (error.status == 400) {
      //         this.translate.get('accounting.errorFound').subscribe((value) => {
      //           this.toastService.openSnackError(value);
      //         });
      //       }
      //     }
      //   );
      // }
      if (type == 'additionalCosts') {
        if (
          this.costData.cost[type] != null &&
          this.costData.cost[type][0].items != null
        ) {
          this.costData.cost[type][0].items
            .find((x) => x.conceptId == conceptId)
            .cost.splice(index, 1);
        }
      } else {
        if (this.costData.cost[type] != null) {
          this.costData.cost[type]
            .find((x) => x.conceptId == conceptId)
            .cost.splice(index, 1);
        }
      }

    }
  }
  onEnergyCostConceptChange($event): any { }

  GetRemaingCosts(costConcept: number): any {
    if (costConcept && this.costData != null) {
      return this.costData.cost.energy.find(
        (x) => x.conceptCode == costConcept
      );
    }
    return [];
  }

  costDataInitialSettings(): any {
    if (this.costData != null) {
      if (this.costData.cost.energy) {
        this.costData.cost.energy.forEach((element) => {
          element["conceptName"] = element.description;
          if (element.quantities == null) {
            element.quantities = new EnergyCostQuantity();
          }
          else {
            // if (element.quantities.closingQuantity != null) {
            //   element.quantities.closingQuantity = this.replaceDotWithComma(element.quantities.closingQuantity);
            // }
            // if (element.quantities.openingAmount != null) {
            //   element.quantities.openingAmount = this.replaceDotWithComma(element.quantities.openingAmount);
            // }
            // if (element.quantities.openingQuantity != null) {
            //   element.quantities.openingQuantity = this.replaceDotWithComma(element.quantities.openingQuantity);
            // }
          }
          this.addCostDetail(
            'energy',
            element.conceptCode,
            true,
            element.conceptId
          );
          element.cost.forEach((cost) => {
            this.calculateNetAmount('energy', cost.costId, element.conceptId);
            // this.valueChange(cost.consumption, element.conceptId, cost.costId, 'energy', 'consumption');
            // this.valueChange(cost.vat, element.conceptId, cost.costId, 'energy', 'vat');
            // this.valueChange(cost.amountBrutto, element.conceptId, cost.costId, 'energy', 'amountBrutto');
            if (element.vat != null && cost.vat == null) {
              cost.vat = element.vat;
            }
          });
          this.energyConsumptionWarning(element.conceptId, 0, 'b');
        });
      }
      if (this.costData.cost.heating) {
        this.costData.cost.heating.forEach((element) => {
          element["conceptName"] = element.description;
          this.addCostDetail(
            'heating',
            element.conceptCode,
            true,
            element.conceptId
          );
          element.cost.forEach((cost) => {
            this.calculateNetAmount('heating', cost.costId, element.conceptId);
            // this.valueChange(cost.wageShare, element.conceptId, cost.costId, 'heating', 'wageShare');
            // this.valueChange(cost.vat, element.conceptId, cost.costId, 'heating', 'vat');
            // this.valueChange(cost.amountBrutto, element.conceptId, cost.costId, 'heating', 'amountBrutto');
            if (element.vat != null && cost.vat == null) {
              cost.vat = element.vat;
            }
            if (cost.wageShareTypeId != null && cost.wageShareTypeId != "-") {
              cost["wageShareDescription"] = this.wageShareType.find(
                (x) => x.code == cost.wageShareTypeId
              ).value;
            }
          });
        });
      }
      if (this.costData.cost.heatingAdditional) {
        this.costData.cost.heatingAdditional.forEach((element) => {
          element["conceptName"] = element.description;
          this.addCostDetail(
            'heatingAdditional',
            element.conceptCode,
            true,
            element.conceptId
          );
          element.cost.forEach((cost) => {
            this.calculateNetAmount(
              'heatingAdditional',
              cost.costId,
              element.conceptId
            );
            // this.valueChange(cost.wageShare, element.conceptId, cost.costId, 'heatingAdditional', 'wageShare');
            // this.valueChange(cost.vat, element.conceptId, cost.costId, 'heatingAdditional', 'vat');
            // this.valueChange(cost.amountBrutto, element.conceptId, cost.costId, 'heatingAdditional', 'amountBrutto');
            if (element.vat != null && cost.vat == null) {
              cost.vat = element.vat;
            }
            if (cost.wageShareTypeId != null && cost.wageShareTypeId != "-") {
              cost["wageShareDescription"] = this.wageShareType.find(
                (x) => x.code == cost.wageShareTypeId
              ).value;
            }
          });
        });
      }
      if (this.costData.cost.hotWaterAdditional) {
        this.costData.cost.hotWaterAdditional.forEach((element) => {
          element["conceptName"] = element.description;
          this.addCostDetail(
            'hotWaterAdditional',
            element.conceptCode,
            true,
            element.conceptId
          );
          element.cost.forEach((cost) => {
            this.calculateNetAmount(
              'hotWaterAdditional',
              cost.costId,
              element.conceptId
            );
            // this.valueChange(cost.wageShare, element.conceptId, cost.costId, 'hotWaterAdditional', 'wageShare');
            // this.valueChange(cost.vat, element.conceptId, cost.costId, 'hotWaterAdditional', 'vat');
            // this.valueChange(cost.amountBrutto, element.conceptId, cost.costId, 'hotWaterAdditional', 'amountBrutto');
            if (element.vat != null && cost.vat == null) {
              cost.vat = element.vat;
            }
            if (cost.wageShareTypeId != null && cost.wageShareTypeId != "-") {
              cost["wageShareDescription"] = this.wageShareType.find(
                (x) => x.code == cost.wageShareTypeId
              ).value;
            }
          });
        });
      }
      if (this.costData.cost.additionalCosts[0].items) {
        this.costData.cost.additionalCosts[0].items.forEach((element) => {
          element["conceptName"] = element.description;
          this.addCostDetail(
            'additionalCosts',
            element.conceptCode,
            true,
            element.conceptId
          );
          element.cost.forEach((cost) => {
            this.calculateNetAmount(
              'additionalCosts',
              cost.costId,
              element.conceptId
            );
            // this.valueChange(cost.wageShare, element.conceptId, cost.costId, 'additionalCosts', 'wageShare');
            // this.valueChange(cost.vat, element.conceptId, cost.costId, 'additionalCosts', 'vat');
            // this.valueChange(cost.amountBrutto, element.conceptId, cost.costId, 'additionalCosts', 'amountBrutto');
            if (element.vat != null && cost.vat == null) {
              cost.vat = element.vat;
            }
            if (cost.wageShareTypeId != null && cost.wageShareTypeId != "-") {
              cost["wageShareDescription"] = this.wageShareType.find(
                (x) => x.code == cost.wageShareTypeId
              ).value;
            }
          });
          if (element.calculationKey != null) {
            element.calculationKeyDescription = this.calculationKeys.find(
              (x) => x.code == element.calculationKey
            ).value;
          }
        });
      }
    }
  }

  addCostDetail(
    type: string,
    conceptCode: number,
    initialInd: boolean,
    conceptId: number
  ): any {
    if (this.costData == null) {
      return;
    }
    if (conceptCode) {
      let lastId = -1;

      if (type == 'additionalCosts') {
        if (
          this.costData.cost[type] != null &&
          this.costData.cost[type][0].items != null
        ) {
          let costConcept = this.costData.cost[type][0].items.find(
            (x) => x.conceptId == conceptId
          );
          if (costConcept != null) {
            if (costConcept.cost.filter((x) => x.costId < 1).length > 0) {
              let id = Math.min.apply(
                Math,
                costConcept.cost.map(function (o) {
                  return o.costId;
                })
              );
              lastId = --id;
            }

            if (initialInd) {
              if (costConcept.cost.length == 0) {
                costConcept.cost.push(
                  this.getCostDetailObj(lastId, initialInd)
                );
              }
            } else {
              costConcept.showRow = true;
              costConcept.cost.push(this.getCostDetailObj(lastId, initialInd));
            }
          }
        }
      } else {
        if (this.costData.cost[type] != null) {
          let costConcept = this.costData.cost[type].find(
            (x) => x.conceptId == conceptId
          );
          if (costConcept != null) {
            if (costConcept.cost.filter((x) => x.costId < 1).length > 0) {
              let id = Math.min.apply(
                Math,
                costConcept.cost.map(function (o) {
                  return o.costId;
                })
              );
              lastId = --id;
            }

            if (initialInd) {
              if (costConcept.cost.length == 0) {
                costConcept.cost.push(
                  this.getCostDetailObj(lastId, initialInd)
                );
              }
            } else {
              costConcept.showRow = true;
              costConcept.cost.push(this.getCostDetailObj(lastId, initialInd));
            }
          }
        }
      }
    } else {
      this.translate
        .get('accounting.firstselectCostConcept')
        .subscribe((value) => {
          this.toastService.openSnackSuccessfully(value);
        });
    }
  }

  getCostDetailObj(id: number, initialInd = false): any {
    // let d = new Date();
    // let costDetail = new CostDetail({costId:as})

    return {

      costId: id
      , units: null
      , amountNetto: null
      , vat: null
      , consumption: null
      , wageShare: null
      , amountBrutto: null

      , comments: null
      , invoiceFileContents: null
      , editableInd: true
      , internalInd: false
      , lastConsumption: null
    }
    // return costDetail;
  }

  getCostConceptObj(id: number): any {
    let obj = {
      conceptId: id,
      propertyId: this.accountingService.property.id,
      payrollYearId: this.accountingService.property.billingPeroidId,
      conceptCode: null,
      description: null,
      vat: null,
      calculationKey: null,
      editableInd: true,
      comments: null,
      totalAmountLastPeriod: null,
      cost: new Array<CostDetail>(),
      quantities: new EnergyCostQuantity()

    }
    obj.cost.push(this.getCostDetailObj(-1));
    return obj;
  }
  getValueToNumber(conceptCode: string): any {
    this.costData.cost.additionalCosts.generalElectricityInd;
    return parseInt(conceptCode, 10);
  }
  showOilPalletsOrLiquidGasSection(section: string, conceptCode: number): any {
    conceptCode = Number(conceptCode);
    if (conceptCode) {
      // this.costData.cost.energy.find(x => x.conceptCode == conceptCode).quantities = new EnergyCostQuantity();
      if (section == 'OilPallets') {
        if (this.OilPalletsConceptCodes.indexOf(conceptCode) > -1) {
          return true;
        } else {
          return false;
        }
      } else if (section == 'LiquidGas') {
        if (this.liquidGasConceptCodes.indexOf(conceptCode) > -1) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  conceptIsSame() {
    let a = ["energy", "heating", "heatingAdditional", "hotWaterAdditional", "additionalCosts"]
    let alreadyExistConcepts = [];
    a.forEach(costType => {
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          this.costData.cost[costType][0].items.forEach(parentConcept => {
            if (parentConcept.description == "") {
              parentConcept.description = null;
            }
            this.costData.cost[costType][0].items.forEach(childConcept => {
              if (childConcept.description == "") {
                childConcept.description = null;
              }

              if (
                parentConcept.conceptId != childConcept.conceptId &&
                parentConcept.conceptCode == childConcept.conceptCode && parentConcept.description == childConcept.description
              ) {
                if (parentConcept.conceptCode != "-" && parentConcept.conceptCode != null) {
                  alreadyExistConcepts.push(this.getConceptDescription(parentConcept.conceptCode, parentConcept.description));
                }

              }
            });
          });
        }
      } else {
        if (costType != "energy" && this.costData.cost[costType] != null) {
          this.costData.cost[costType].forEach(parentConcept => {
            if (parentConcept.description == "") {
              parentConcept.description = null;
            }
            this.costData.cost[costType].forEach(childConcept => {
              if (childConcept.description == "") {
                childConcept.description = null;
              }

              if (
                parentConcept.conceptId != childConcept.conceptId &&
                parentConcept.conceptCode == childConcept.conceptCode && parentConcept.description == childConcept.description
              ) {
                if (parentConcept.conceptCode != "-" && parentConcept.conceptCode != null) {
                  alreadyExistConcepts.push(this.getConceptDescription(parentConcept.conceptCode, parentConcept.description));
                }
              }
            });
          });



        }
      }
    });
    if (alreadyExistConcepts.length > 0) {
      this.translate
        .get('accounting.conceptAlreadySelected')
        .subscribe((value) => {
          let uniqueList = alreadyExistConcepts.toString().split(',').filter(function (item, i, allItems) {
            return i == allItems.indexOf(item);
          }).join(',');
          this.toastService.openSnackInfo('(' + uniqueList.toString() + ')' + value);
        });
      return true;
    }
    else {
      return false;
    }
  }
  save(): any {
    if (this.costData == null) {
      return;
    }
    if (this.conceptIsSame()) {
      return;
    }
    this.accountingService.property.billingPeriod;
    this.accountingService.costDataSubject.next(this.costData);

    this.accountingService.actualCostData = JSON.parse(
      JSON.stringify(this.costData)
    );
    if (this.validation()) {
      this.toast.openSnackError(this.accountingValidationErrorMessage);
      return;
    }
    this.changeIdsToNullAndNbrToNbr();
    this.accountingService.saveCostData(this.costData).subscribe(
      (res) => {
        this.costData = null;
        this.accountingService.actualCostData = null;
        this.costData = res.data;
        this.accountingService.costDataSubject.next(this.costData);
        this.accountingService.actualCostData = JSON.parse(
          JSON.stringify(this.costData)
        );
        if (this.costData != null) {
          this.costDataInitialSettings();
        }
        this.costDataOriginal = JSON.parse(JSON.stringify(this.costData));
        this.readonlyInd =
          this.accountingService.property.billingStatus == 'WAIT_DATA' &&
            this.accountingService.property.dta == 'N' &&
            !this.costData.confirmTheCompletenessInd
            ? false
            : true;

        this.translate
          .get('miscellaneous.addedSuccessfully')
          .subscribe((value) => {
            this.toastService.openSnackSuccessfully(value);
          });
      },
      (err) => {
        this.toast.openSnackError(this.accountingSaveErrorMessage);
      }
    );
  }
  changeIdsToNullAndNbrToNbr(): any {
    if (this.costData == null) {
      return;
    }
    if (this.costData.cost.energy != null) {
      this.costData.cost.energy.forEach((element) => {
        if (element.description == null && element.conceptCode != null) {
          element.description = this.options.find(
            (x) => x.code == element.conceptCode
          ).value;
        }
        let cost = [];
        if (element.conceptId < 0 || element.conceptId == null) {
          element.conceptId = -1;
        }
        // if (element.totalAmountLastPeriod != null) {
        //   element.totalAmountLastPeriod = Number(element.totalAmountLastPeriod.toString().replace(",", "."))
        // }
        // if (element.quantities != null) {
        //   if (element.quantities.closingQuantity != null) {
        //     element.quantities.closingQuantity = this.ToDecimal(element.quantities.closingQuantity);
        //   }
        //   if (element.quantities.openingAmount != null) {
        //     element.quantities.openingAmount = this.ToDecimal(element.quantities.openingAmount);
        //   }
        //   if (element.quantities.openingQuantity != null) {
        //     element.quantities.openingQuantity = this.ToDecimal(element.quantities.openingQuantity);
        //   }
        // }
        if (element.cost != null) {
          element.cost.forEach((x) => {
            this.NbrToNbr(x);
            if (x.costId < 0 || x.costId == null) {
              x.costId = -1;
            }

            cost.push(x);
          });
          element.cost = cost;
        }
      });
    }
    if (this.costData.cost.heating != null) {
      this.costData.cost.heating.forEach((element) => {
        if (element.description == null && element.conceptCode != null) {
          element.description = this.options.find(
            (x) => x.code == element.conceptCode
          ).value;
        }
        let cost = [];
        if (element.conceptId < 0 || element.conceptId == null) {
          element.conceptId = -1;
        }
        if (element.cost != null) {
          element.cost.forEach((x) => {
            this.NbrToNbr(x);
            if (x.costId < 0 || x.costId == null) {
              x.costId = -1;
            }
            if (!element.editableInd) {
              if (x.costId > 0) {
                cost.push(x);
              }
            } else {
              cost.push(x);
            }
          });
          element.cost = cost;
        }
      });
    }
    if (this.costData.cost.additionalCosts[0].items != null) {
      if (this.costData.cost.additionalCosts[0].wastewater != null) {
        this.costData.cost.additionalCosts[0].wastewater = Number(
          this.costData.cost.additionalCosts[0].wastewater
        );
      }
      if (this.costData.cost.additionalCosts[0].waterConsumption != null) {
        this.costData.cost.additionalCosts[0].waterConsumption = Number(
          this.costData.cost.additionalCosts[0].waterConsumption
        );
      }
      this.costData.cost.additionalCosts[0].items.forEach((element) => {
        if (element.description == null && element.conceptCode != null) {
          element.description = this.options.find(
            (x) => x.code == element.conceptCode
          ).value;
        }
        let cost = [];
        if (element.conceptId < 0 || element.conceptId == null) {
          element.conceptId = -1;
        }
        if (element.cost != null) {
          element.cost.forEach((x) => {
            this.NbrToNbr(x);
            if (x.costId < 0 || x.costId == null) {
              x.costId = -1;
            }
            if (!element.editableInd) {
              if (x.costId > 0) {
                cost.push(x);
              }
            } else {
              cost.push(x);
            }
          });
          element.cost = cost;
        }
      });
    }
    if (this.costData.cost.hotWaterAdditional != null) {
      this.costData.cost.hotWaterAdditional.forEach((element) => {
        if (element.description == null && element.conceptCode != null) {
          element.description = this.options.find(
            (x) => x.code == element.conceptCode
          ).value;
        }
        let cost = [];
        if (element.conceptId < 0 || element.conceptId == null) {
          element.conceptId = -1;
        }
        if (element.cost != null) {
          element.cost.forEach((x) => {
            this.NbrToNbr(x);
            if (x.costId < 0 || x.costId == null) {
              x.costId = -1;
            }
            if (!element.editableInd) {
              if (x.costId > 0) {
                cost.push(x);
              }
            } else {
              cost.push(x);
            }
          });
          element.cost = cost;
        }
      });
    }
    if (this.costData.cost.heatingAdditional != null) {
      this.costData.cost.heatingAdditional.forEach((element) => {
        if (element.description == null && element.conceptCode != null) {
          element.description = this.options.find(
            (x) => x.code == element.conceptCode
          ).value;
        }
        let cost = [];
        if (element.conceptId < 0 || element.conceptId == null) {
          element.conceptId = -1;
        }
        if (element.cost != null) {
          element.cost.forEach((x) => {
            this.NbrToNbr(x);
            if (x.costId < 0 || x.costId == null) {
              x.costId = -1;
            }
            if (!element.editableInd) {
              if (x.costId > 0) {
                cost.push(x);
              }
            } else {
              cost.push(x);
            }
          });
          element.cost = cost;
        }
      });
    }
  }
  NbrToNbr(cost): any {
    // if (cost.amountNetto != null) {
    //   cost.amountNetto = Number(cost.amountNetto);
    // }
    // if (cost.vat != null) {
    //   cost.vat = Number(this.replaceCommaToDecimal(cost.vat));
    // }
    // if (cost.consumption != null) {
    //   cost.consumption = Number(this.replaceCommaToDecimal(cost.consumption));
    // }
    // if (cost.wageShare != null) {
    //   cost.wageShare = Number(this.replaceCommaToDecimal(cost.wageShare));
    // }
    // if (cost.amountBrutto != null) {
    //   cost.amountBrutto = Number(this.replaceCommaToDecimal(cost.amountBrutto));
    // }
  }
  attachImage(e, conceptId, costType, costId): any {
    let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      if (parseFloat(sizeInMB) > 5) {
        this.translate.get('accounting.fileSizeMsg').subscribe((value) => {
          alert(value);
        });
        return;
      }
      let pattern = /image|pdf|spreadsheetml|wordprocessingml-*/;
      if (!file.type.match(pattern)) {
        this.translate.get('accounting.invalidFormat').subscribe((value) => {
          alert(value);
        });
        return;
      }
    }
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(
        this,
        file.name,
        conceptId,
        costType,
        costId
      );
      reader.readAsDataURL(file);
    }
  }
  _handleReaderLoaded(filename, conceptId, costType, costId, e): any {
    if (this.costData == null) {
      return;
    }
    let reader = e.target;
    if (costType == 'additionalCosts') {
      if (
        this.costData.cost[costType] != null &&
        this.costData.cost[costType][0].items != null
      ) {
        let cost = this.costData.cost[costType][0].items
          .find((x) => x.conceptId == conceptId)
          .cost.find((x) => x.costId == costId);
        if (cost.invoiceFileContents == null) {
          cost.invoiceFileContents = []
        }
        cost.invoiceFileContents.push(
          {
            content: reader.result.split('base64,')[1],
            filename: filename
          }
        );
      }
    } else {
      let cost = this.costData.cost[costType]
        .find((x) => x.conceptId == conceptId)
        .cost.find((x) => x.costId == costId);
      if (cost.invoiceFileContents == null) {
        cost.invoiceFileContents = []
      }
      cost.invoiceFileContents.push(
        {
          content: reader.result.split('base64,')[1],
          filename: filename
        }
      );
    }
  }
  getTotal(costType): any {
    let total = 0;
    if (this.costData != null) {
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          total = this.costData.cost[costType][0].items.length;
        }
      } else {
        if (this.costData.cost[costType] != null) {
          total = this.costData.cost[costType].length;
        }
      }
      return total;
    }
  }
  openExpension(type, openInd): any {
    // console.log(type+","+open)
    this.expensionOpen.forEach((element) => {
      if (element.type == type) {
        element.open = openInd;
      }
    });
  }
  totalNetAmount(costType): any {
    let total = 0;
    if (this.costData != null) {
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          this.costData.cost[costType][0].items.forEach((element) => {
            if (element.cost != null) {
              element.cost.forEach((cost) => {
                total += cost.amountBrutto;
              });
            }
          });
        }
      } else {
        if (this.costData.cost[costType] != null) {
          this.costData.cost[costType].forEach((element) => {
            if (element.cost != null) {
              element.cost.forEach((cost) => {
                total += cost.amountBrutto;
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
  }
  isExpensionOpen(type): any {
    let isOpen = false;
    this.expensionOpen.forEach((element) => {
      if (element.type == type) {
        isOpen = element.open;
      }
    });
    return isOpen;
  }
  getInputError(name, i, x): any {
    if (this.costDataForm) {
      if (this.costDataForm.form.controls[name + i + x] == undefined) {
        return false;
      }
      if (this.costDataForm.form.controls[name + i + x].status == 'DISABLED') {
        return false;
      }
      return !this.costDataForm.form.controls[name + i + x]?.valid;
    } else {
      return false;
    }
  }
  isErrorPossible(name, i, x, costConcept, cost): any {
    if (this.costDataForm) {
      if (cost.internalInd || !costConcept.editableInd) {
        return false;
      }
      if (this.costDataForm.form.controls[name + i + x] == undefined) {
        return false;
      }
      if (this.costDataForm.form.controls[name + i + x].status == 'DISABLED') {
        return false;
      }
      return true;
    }
    return true;
  }
  openCost(obj): any {
    this.openExpension(obj.type, true);
    this.costType = obj.type;
    this.openCostConcept(obj.type, obj.conceptId);
  }
  openCostConcept(costType, conceptId): any {
    if (this.costData != null) {
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          this.costData.cost[costType][0].items.forEach((element) => {
            if (element.conceptId == conceptId) {
              element.showRow = true;
            }
          });
        }
      } else {
        if (this.costData.cost[costType] != null) {
          this.costData.cost[costType].forEach((element) => {
            if (element.conceptId == conceptId) {
              element.showRow = true;
            }
          });
        }
      }
    }
  }
  onConceptTypeChange(costType, conceptId, $event): any {
    if (this.costData != null) {
      // if (this.canMultipleCostConcept.indexOf($event.value) > -1) {
      //   return;
      // }

      let alreadyexistsInd = false;
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          let costConcept = this.costData.cost[costType][0].items.find(x => x.conceptId == conceptId);

          this.costData.cost[costType][0].items.forEach((element) => {
            if (element.comments == "") {
              element.comments = null;
            }
            if (
              element.conceptId != conceptId &&
              element.conceptCode == $event.value && element.comments == costConcept.comments
            ) {
              alreadyexistsInd = true;
            }
            else if (element.conceptId == conceptId) {
              element.description = this.options.find(
                (x) => x.code == element.conceptCode
              ).value;
            }
          });
        }
      } else {
        if (costType != "energy" && this.costData.cost[costType] != null) {
          let costConcept = this.costData.cost[costType].find(x => x.conceptId == conceptId);
          this.costData.cost[costType].forEach((element) => {
            if (element.comments == "") {
              element.comments = null;
            }
            if (
              element.conceptId != conceptId &&
              element.conceptCode == $event.value && element.comments == costConcept.comments
            ) {
              alreadyexistsInd = true;
            }
            else if (element.conceptId == conceptId) {
              element.description = this.options.find(
                (x) => x.code == element.conceptCode
              ).value;
            }
          });
        }
      }
      if (alreadyexistsInd) {
        this.translate
          .get('accounting.conceptAlreadySelected')
          .subscribe((value) => {
            this.toastService.openSnackInfo(value);
          });
      }
    }
  }
  deleteCostConcept(costType, conceptId): any {
    if (this.costData != null) {
      let costConcept = [];
      // if (conceptId && conceptId > 0) {
      //   this.accountingService.deleteConcept(conceptId).subscribe(
      //     (res) => {
      //       this.translate
      //         .get('accounting.conceptDeletedSuccessfully')
      //         .subscribe((value) => {
      //           this.toastService.openSnackSuccessfully(value);
      //         });
      //     },
      //     (error) => {
      //       if (error.status == 400) {
      //         this.translate.get('accounting.errorFound').subscribe((value) => {
      //           this.toastService.openSnackError(value);
      //         });
      //       }
      //     }
      //   );
      // }
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          this.costData.cost[costType][0].items.forEach((item, index) => {
            if (item.conceptId == conceptId)
              this.costData.cost[costType][0].items.splice(index, 1);
          });
        }
      } else {
        if (this.costData.cost[costType] != null) {
          this.costData.cost[costType].forEach((item, index) => {
            if (item.conceptId == conceptId)
              this.costData.cost[costType].splice(index, 1);
          });
        }
      }
    }
  }
  isToolTip(type, conceptId): any {
    let toolTipInd = false;
    if (this.costData != null) {
      if (
        this.costData.cost.energy != null &&
        type == 'energy' &&
        this.costData.cost.energy.find((x) => x.conceptId == conceptId)
          .conceptCode != null
      ) {
        let conceptCode = this.costData.cost.energy.find(
          (x) => x.conceptId == conceptId
        ).conceptCode;
        if (conceptCode != null) {
          toolTipInd = this.getText(conceptCode);
        }
      } else if (
        this.costData.cost.heating != null &&
        type == 'heating' &&
        this.costData.cost.heating.find((x) => x.conceptId == conceptId)
          .conceptCode != null
      ) {
        let conceptCode = this.costData.cost.heating.find(
          (x) => x.conceptId == conceptId
        ).conceptCode;
        if (conceptCode != null) {
          toolTipInd = this.getText(conceptCode);
        }
      } else if (
        this.costData.cost.additionalCosts != null &&
        type == 'additionalCosts' &&
        this.costData.cost.additionalCosts[0].items.find(
          (x) => x.conceptId == conceptId
        ).conceptCode != null
      ) {
        let conceptCode = this.costData.cost.additionalCosts[0].items.find(
          (x) => x.conceptId == conceptId
        ).conceptCode;
        if (conceptCode != null) {
          toolTipInd = this.getText(conceptCode);
        }
      } else if (
        this.costData.cost.hotWaterAdditional != null &&
        type == 'hotWaterAdditional' &&
        this.costData.cost.hotWaterAdditional.find(
          (x) => x.conceptId == conceptId
        ).conceptCode != null
      ) {
        let conceptCode = this.costData.cost.hotWaterAdditional.find(
          (x) => x.conceptId == conceptId
        ).conceptCode;
        if (conceptCode != null) {
          toolTipInd = this.getText(conceptCode);
        }
      } else if (
        this.costData.cost.heatingAdditional != null &&
        type == 'heatingAdditional' &&
        this.costData.cost.heatingAdditional.find(
          (x) => x.conceptId == conceptId
        ).conceptCode != null
      ) {
        let conceptCode = this.costData.cost.heatingAdditional.find(
          (x) => x.conceptId == conceptId
        ).conceptCode;
        if (conceptCode != null) {
          toolTipInd = this.getText(conceptCode);
        }
      }
    }
    return toolTipInd;
  }
  getText(code): any {
    let list1 = [8, 194, 193, 153, 133, 134, 135, 151];
    let list2 = [111];
    let list3 = [817, 821];
    let list4 = [820];
    let list5 = [308];

    if (list1.indexOf(code) > -1) {
      this.translate.get('accounting.tooltipText1').subscribe((value) => {
        this.toolTipText = value;
      });
      return true;
    } else if (list2.indexOf(code) > -1) {
      this.translate.get('accounting.tooltipText2').subscribe((value) => {
        this.toolTipText = value;
      });
      return true;
    } else if (list3.indexOf(code) > -1) {
      this.translate.get('accounting.tooltipText3').subscribe((value) => {
        this.toolTipText = value;
      });
      return true;
    } else if (list4.indexOf(code) > -1) {
      this.translate.get('accounting.tooltipText4').subscribe((value) => {
        this.toolTipText = value;
      });
      return true;
    } else if (list5.indexOf(code) > -1) {
      this.translate.get('accounting.tooltipText5').subscribe((value) => {
        this.toolTipText = value;
      });
      return true;
    } else {
      return false;
    }
  }
  isRequired() {
    if (this.costData == null) {
      return false;
    }
    let requiredInd = false;
    if (
      this.costData.cost.additionalCosts != null &&
      this.costData.cost.additionalCosts[0].items != null
    ) {
      this.costData.cost.additionalCosts[0].items.forEach((item, index) => {
        if (item.conceptCode == 801) {
          requiredInd = true;
        }
      });
    }
    return requiredInd;
  }
  isChanged(): boolean {
    this.removeShowAttribute();
    if (
      JSON.stringify(this.costData) !== JSON.stringify(this.costDataOriginal)
    ) {
      return true;
    }
    return false;
  }
  removeShowAttribute() {
    if (this.costData != null) {
      this.costCategory.forEach(costCategory => {
        this.costData.cost[costCategory.type].forEach(concept => {
          delete concept.showRow;
        });
      });      
    }    
  }
  discardChanges(): any {
    this.costData = JSON.parse(JSON.stringify(this.costDataOriginal));
    this.accountingService.costDataSubject.next(this.costData);
    this.accountingService.actualCostData = JSON.parse(
      JSON.stringify(this.costData)
    );
  }

  calculateNetAmount(costType, costId, conceptId): void {
    if (this.costData != null) {
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          let cost = this.costData.cost[costType][0].items
            .find((x) => x.conceptId == conceptId)
            .cost.find((y) => y.costId == costId);

          if (
            cost.amountBrutto != null &&
            cost.vat != null &&
            cost.amountBrutto != 0 &&
            cost.vat != 0
          ) {
            cost.amountNetto = cost.amountBrutto / ((1 + cost.vat) / 100);
            cost.amountNetto = parseFloat(cost.amountNetto.toFixed(2));
          } else {
            cost.amountNetto = null;
          }
        }
      } else {
        if (this.costData.cost[costType] != null) {
          let cost = this.costData.cost[costType]
            .find((x) => x.conceptId == conceptId)
            .cost.find((y) => y.costId == costId);

          if (
            cost.amountBrutto != null &&
            cost.vat != null &&
            cost.amountBrutto != 0 &&
            cost.vat != 0
          ) {
            cost.amountNetto = cost.amountBrutto / ((1 +cost.vat) / 100);
            cost.amountNetto = parseFloat(cost.amountNetto.toFixed(2));
          } else {
            cost.amountNetto = null;
          }
        }
      }
    }
    this.accountingService.costDataSubject.next(this.costData);
  }
  isInternal(conceptCode): any {
    if (this.costData != null && conceptCode != null) {
      let costConcept = this.options.find((x) => x.code == conceptCode);
      if (costConcept == null) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  getFilledCostConcepts(costType) {
    let filled = 0;
    let total = 0;
    if (this.costData != null) {
      if (costType == "additionalCosts") {
        if (this.costData.cost[costType] != null && this.costData.cost[costType][0].items != null) {
          total = this.costData.cost[costType][0].items.length;
          this.costData.cost[costType][0].items.forEach(element => {
            if (element.cost.length > 0) {
              let filledCost = element.cost.find(cost => cost.amountBrutto > 0);
              if (filledCost) {
                filled++;
              }
            }
          });
        }
      }
      else {
        if (this.costData.cost[costType] != null) {
          total = this.costData.cost[costType].length;
          this.costData.cost[costType].forEach(element => {
            if (element.cost.length > 0) {
              let filledCost = element.cost.find(cost => cost.amountBrutto > 0);
              if (filledCost) {
                filled++;
              }
            }
          });
        }
      }

      return filled.toString() + " " + this.von + " " + total.toString();
    }
  }
  energyConsumptionWarning(conceptId, costId, whatHaveToCheck) {

    let costConcept = this.costData.cost["energy"].find(x => x.conceptId == conceptId);
    let costs = [];
    if (costId != 0) {
      costs.push(costConcept.cost.find(x => x.costId == costId));
    }
    else {
      costs = costConcept.cost;
    }
    costs.forEach(cost => {
      let consumptionInd = false;
      let dateInd = false;

      if ((costConcept.totalAmountLastPeriod != null && cost.consumption != null && cost.consumption != null) && (whatHaveToCheck == "b" || whatHaveToCheck == "c")) {
        let consumption = cost.consumption;
        let twenty = (20 / 100) * costConcept.totalAmountLastPeriod;

        if ((consumption > (costConcept.totalAmountLastPeriod + twenty)) || (consumption < (costConcept.totalAmountLastPeriod - twenty))) {
          // cost["warning"]=true;
          consumptionInd = true;
        }
      }

      if (this.dateTimeWarning.indexOf(costConcept.conceptCode) > -1 && (whatHaveToCheck == "b" || whatHaveToCheck == "d")) {
        let invoiceDate = new Date(cost.invoiceDate);
        if (invoiceDate < new Date(this.accountingService.currentBillingPeroid.from) || invoiceDate >= new Date(this.accountingService.currentBillingPeroid.to)) {
          dateInd = true
        }
      }

      if (consumptionInd && dateInd) {
        cost["warning"] = true;
        cost["warningTemplate"] = "energyWarningBoth";
      }
      else if (consumptionInd) {
        cost["warning"] = true;
        cost["warningTemplate"] = "energyWarningConsunption";
      }
      else if (dateInd) {
        cost["warning"] = true;
        cost["warningTemplate"] = "energyWarningDate";
      }
      else {
        cost["warning"] = false;
      }

    });
  }
  isSpecificEnergyCostConcept(conceptCode) {
    if (this.dateTimeWarning.indexOf(conceptCode) > -1) {
      return true;
    }
    else {
      return false;
    }
  }
  valueChange(value, conceptId, costId, costType, field) {
    if (this.costData != null) {
      if (costType == "additionalCosts") {
        if (this.costData.cost[costType] != null && this.costData.cost[costType][0].items != null) {
          let cost = this.costData.cost[costType][0].items.find(x => x.conceptId == conceptId).cost.find(x => x.costId == costId);
          if (cost != null) {
            if (value != null) {
              cost[field] = value.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
          }
        }
      }
      else {
        if (this.costData.cost[costType] != null) {
          let cost = this.costData.cost[costType].find(x => x.conceptId == conceptId).cost.find(x => x.costId == costId);
          if (cost != null) {
            if (value != null) {
              cost[field] = value.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
          }
        }
      }
    }
  }
  replaceCommaToDecimal(value) {
    if (value != null) {
      return value.toString().replace(",", ".");
    }
    else {
      return value;
    }
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  generalElectricityConceptrIsExists() {
    let concept = this.costData.cost["additionalCosts"][0].items.find(x => x.conceptCode?.toString() == "801")
    if (concept != null) {
      return true;
    }
    else {
      return false;
    }
  }
  deleteComment(costType, costId, conceptId) {
    if (this.costData != null) {
      if (costType == "additionalCosts") {
        if (this.costData.cost[costType] != null && this.costData.cost[costType][0].items != null) {
          let cost = this.costData.cost[costType][0].items.find(x => x.conceptId == conceptId).cost.find(x => x.costId == costId);
          if (cost != null) {
            cost.comments = null;
          }
        }
      }
      else {
        if (this.costData.cost[costType] != null) {
          let cost = this.costData.cost[costType].find(x => x.conceptId == conceptId).cost.find(x => x.costId == costId);
          if (cost != null) {
            cost.comments = null;
          }
        }
      }
    }
  }
  onWageShareTypeChange(costType, conceptId, costId, $event) {
    if (this.costData != null && $event.value != null) {


      let alreadyexistsInd = false;
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          let cost = this.costData.cost[costType][0].items
            .find((x) => x.conceptId == conceptId)
            .cost.find((x) => x.costId == costId);

          cost.wageShareDescription = this.wageShareType.find(
            (x) => x.code == $event.value
          ).value;
        }
      } else {
        if (this.costData.cost[costType] != null) {
          let cost = this.costData.cost[costType]
            .find((x) => x.conceptId == conceptId)
            .cost.find((x) => x.costId == costId);

          cost.wageShareDescription = this.wageShareType.find(
            (x) => x.code == $event.value
          ).value;


        }
      }

    }
  }
  replaceDotWithComma(data) {
    if (data != null) {
      let re = /\./gi;
      return data.toString().replace(re, ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    else {
      return data;
    }
  }
  onCalculationKeyChange(conceptId, costId) {
    if (this.costData != null) {

      if (
        this.costData.cost.additionalCosts != null &&
        this.costData.cost.additionalCosts[0].items != null
      ) {
        let concept = this.costData.cost.additionalCosts[0].items
          .find((x) => x.conceptId == conceptId)
        if (concept.calculationKey != null) {
          concept.calculationKeyDescription = this.calculationKeys.find(
            (x) => x.code == concept.calculationKey
          ).value;
        }
      }

    }
  }
  getConceptDescription(conceptCode, description = null) {
    if (this.costData == null || conceptCode == null || conceptCode == "-" || this.options.length < 1) {
      return "";
    }
    if (description != null && this.isInternal(conceptCode)) {
      return description;
    }
    else {
      return this.options.find(
        (x) => x.code == conceptCode
      ).value;
    }
  }
  ToDecimal(value) {
    if (value != null) {
      return value.toString().toString().replace(/\./g, '$').replace(/\,/g, '.').replace(/\$/g, ',');
    }
    else {
      return value;
    }
  }
  AddComma(conceptId, field) {
    let concept = this.costData.cost.energy
      .find((x) => x.conceptId == conceptId);
    concept.quantities[field] = concept.quantities[field].toString().replace(/\./g, ',');
  }


  validation() {
    let newCostData = JSON.parse(JSON.stringify(this.costData));
    let validationExists = false;
    this.costCategory.forEach(costType => {
      costType.isError = false;
      if (newCostData != null) {
        if (costType.type == "energy") {
          newCostData.cost.energy.forEach((element) => {
            let newCost = [];
            if (element.conceptCode == null) {
              this.costCategory.find(x => x.type == "energy").isError = true;
              validationExists = true;
            }
            if (this.OilPalletsConceptCodes.indexOf(element.conceptCode) > -1 || this.liquidGasConceptCodes.indexOf(element.conceptCode) > -1) {
              if (element.quantities.closingQuantity == null) {
                validationExists = true;
              }
            }

            element.cost.forEach((cost) => {

              if ((this.notEqualToEmpty(cost.consumption)) || (this.notEqualToEmpty(cost.amountBrutto)) || (this.notEqualToEmpty(cost.vat)) || (this.notEqualToEmpty(cost.invoiceDate))) {
                if ((this.equalToEmpty(cost.consumption)) || (this.equalToEmpty(cost.amountBrutto)) || (this.equalToEmpty(cost.vat)) || (this.equalToEmpty(cost.invoiceDate))) {
                  this.costCategory.find(x => x.type == "energy").isError = true;
                  validationExists = true;
                  return false;
                }
                newCost.push(cost);
              }
              else {
                if (cost.costId > 0) {
                  if ((this.notEqualToEmpty(cost.consumption)) || (this.notEqualToEmpty(cost.amountBrutto)) || (this.notEqualToEmpty(cost.vat)) || (this.notEqualToEmpty(cost.invoiceDate))) {
                    newCost.push(cost);
                  }
                }
              }

            });
            element.cost = newCost;
          });
        }
        else if (costType.type == "heating") {
          newCostData.cost.heating.forEach((element) => {
            let newCost = [];
            if (element.conceptCode == null) {
              this.costCategory.find(x => x.type == "heating").isError = true;
              validationExists = true;
            }
            element.cost.forEach((cost) => {
              if (cost.internalInd || (!element.editableInd)) {
                newCost.push(cost);
              }
              else {
                if (this.notEqualToEmpty(cost.amountBrutto) || this.notEqualToEmpty(cost.vat) || this.notEqualToEmpty(cost.invoiceDate) || (this.notEqualToEmpty(cost.wageShareTypeId) || this.notEqualToEmpty(cost.wageShare))) {
                  if (this.notEqualToEmpty(cost.wageShareTypeId) && this.equalToEmpty(cost.wageShare)) {
                    this.costCategory.find(x => x.type == "heating").isError = true;
                    validationExists = true;
                    return false;
                  }
                  if (this.equalToEmpty(cost.wageShareTypeId) && this.notEqualToEmpty(cost.wageShare)) {
                    this.costCategory.find(x => x.type == "heating").isError = true;
                    validationExists = true;
                    return false;
                  }
                  if (this.notEqualToEmpty(cost.wageShare) && this.notEqualToEmpty(cost.amountBrutto)) {
                    if (cost.wageShare > cost.amountBrutto) {
                      this.costCategory.find(x => x.type == "heating").isError = true;
                      validationExists = true;
                      return false;
                    }
                  }
                  if (this.equalToEmpty(cost.amountBrutto) || this.equalToEmpty(cost.vat) || this.equalToEmpty(cost.invoiceDate)) {
                    this.costCategory.find(x => x.type == "heating").isError = true;
                    validationExists = true;
                    return false;
                  }
                  newCost.push(cost);

                }
                else {
                  if (cost.costId > 0) {
                    if (this.notEqualToEmpty(cost.amountBrutto) || this.notEqualToEmpty(cost.vat) || this.notEqualToEmpty(cost.invoiceDate) || (this.notEqualToEmpty(cost.wageShareTypeId) || this.notEqualToEmpty(cost.wageShare))) {
                      newCost.push(cost);
                    }
                  }
                }
              }
            });
            element.cost = newCost;
          });
        }
        if (costType.type == "heatingAdditional") {
          newCostData.cost.heatingAdditional.forEach((element) => {
            let newCost = [];
            if (element.conceptCode == null) {
              this.costCategory.find(x => x.type == "heatingAdditional").isError = true;
              validationExists = true;
            }
            element.cost.forEach((cost) => {
              if (cost.internalInd || (!element.editableInd)) {
                newCost.push(cost);
              }
              else {
                if (this.notEqualToEmpty(cost.amountBrutto) || this.notEqualToEmpty(cost.vat) || this.notEqualToEmpty(cost.invoiceDate) || (this.notEqualToEmpty(cost.wageShareTypeId) || this.notEqualToEmpty(cost.wageShare))) {
                  if (this.notEqualToEmpty(cost.wageShareTypeId) && this.equalToEmpty(cost.wageShare)) {
                    this.costCategory.find(x => x.type == "heatingAdditional").isError = true;
                    validationExists = true;
                    return false;
                  }
                  if (this.equalToEmpty(cost.wageShareTypeId) && this.notEqualToEmpty(cost.wageShare)) {
                    this.costCategory.find(x => x.type == "heatingAdditional").isError = true;
                    validationExists = true;
                    return false;
                  }
                  if (this.notEqualToEmpty(cost.wageShare) && this.notEqualToEmpty(cost.amountBrutto)) {
                    if (cost.wageShare > cost.amountBrutto) {
                      this.costCategory.find(x => x.type == "heatingAdditional").isError = true;
                      validationExists = true;
                      return false;
                    }
                  }
                  if (this.equalToEmpty(cost.amountBrutto) || this.equalToEmpty(cost.vat) || this.equalToEmpty(cost.invoiceDate)) {
                    this.costCategory.find(x => x.type == "heatingAdditional").isError = true;
                    validationExists = true;
                    return false;
                  }
                  newCost.push(cost);
                }
                else {
                  if (cost.costId > 0) {
                    if (this.notEqualToEmpty(cost.amountBrutto) || this.notEqualToEmpty(cost.vat) || this.notEqualToEmpty(cost.invoiceDate) || (this.notEqualToEmpty(cost.wageShareTypeId) || this.notEqualToEmpty(cost.wageShare))) {
                      newCost.push(cost);
                    }
                  }
                }
              }
            });
            element.cost = newCost;
          });
        }
        if (costType.type == "hotWaterAdditional") {
          newCostData.cost.hotWaterAdditional.forEach((element) => {
            let newCost = [];
            if (element.conceptCode == null) {
              this.costCategory.find(x => x.type == "hotWaterAdditional").isError = true;
              validationExists = true;
            }
            element.cost.forEach((cost) => {
              if (cost.internalInd || (!element.editableInd)) {
                newCost.push(cost);
              }
              else {
                if (this.notEqualToEmpty(cost.amountBrutto) || this.notEqualToEmpty(cost.vat) || this.notEqualToEmpty(cost.invoiceDate) || (this.notEqualToEmpty(cost.wageShareTypeId) || this.notEqualToEmpty(cost.wageShare))) {
                  if (this.notEqualToEmpty(cost.wageShareTypeId) && this.equalToEmpty(cost.wageShare)) {
                    this.costCategory.find(x => x.type == "hotWaterAdditional").isError = true;
                    validationExists = true;
                    return false;
                  }
                  if (this.equalToEmpty(cost.wageShareTypeId) && this.notEqualToEmpty(cost.wageShare)) {
                    this.costCategory.find(x => x.type == "hotWaterAdditional").isError = true;
                    validationExists = true;
                    return false;
                  }
                  if (this.notEqualToEmpty(cost.wageShare) && this.notEqualToEmpty(cost.amountBrutto)) {
                    if (cost.wageShare > cost.amountBrutto) {
                      this.costCategory.find(x => x.type == "hotWaterAdditional").isError = true;
                      validationExists = true;
                      return false;
                    }
                  }
                  if (this.equalToEmpty(cost.amountBrutto) || this.equalToEmpty(cost.vat) || this.equalToEmpty(cost.invoiceDate)) {
                    this.costCategory.find(x => x.type == "hotWaterAdditional").isError = true;
                    validationExists = true;
                    return false;
                  }
                  newCost.push(cost);
                }
                else {
                  if (cost.costId > 0) {
                    if (this.notEqualToEmpty(cost.amountBrutto) || this.notEqualToEmpty(cost.vat) || this.notEqualToEmpty(cost.invoiceDate) || (this.notEqualToEmpty(cost.wageShareTypeId) || this.notEqualToEmpty(cost.wageShare))) {
                      newCost.push(cost);
                    }
                  }
                }
              }
            });
            element.cost = newCost;
          });
        }
        if (costType.type == "additionalCosts") {
          if (this.generalElectricityConceptrIsExists()) {
            if (this.costData.cost.additionalCosts[0].generalElectricityInd == null) {
              validationExists = true;
            }
          }
          newCostData.cost.additionalCosts[0].items.forEach((element) => {
            let newCost = [];
            if (element.conceptCode == null) {
              this.costCategory.find(x => x.type == "additionalCosts").isError = true;
              validationExists = true;
            }

            element.cost.forEach((cost) => {
              if (cost.internalInd || (!element.editableInd)) {
                newCost.push(cost);
              }
              else {
                if (this.notEqualToEmpty(cost.amountBrutto) || this.notEqualToEmpty(cost.vat) || this.notEqualToEmpty(cost.invoiceDate) || (this.notEqualToEmpty(cost.wageShareTypeId) || this.notEqualToEmpty(cost.wageShare))) {
                  if (this.notEqualToEmpty(cost.wageShareTypeId) && this.equalToEmpty(cost.wageShare)) {
                    this.costCategory.find(x => x.type == "additionalCosts").isError = true;
                    validationExists = true;
                    return false;
                  }
                  if (this.equalToEmpty(cost.wageShareTypeId) && this.notEqualToEmpty(cost.wageShare)) {
                    this.costCategory.find(x => x.type == "additionalCosts").isError = true;
                    validationExists = true;
                    return false;
                  }
                  if (this.notEqualToEmpty(cost.wageShare) && this.notEqualToEmpty(cost.amountBrutto)) {
                    if (cost.wageShare > cost.amountBrutto) {
                      this.costCategory.find(x => x.type == "additionalCosts").isError = true;
                      validationExists = true;
                      return false;
                    }
                  }
                  if (this.equalToEmpty(cost.amountBrutto) || this.equalToEmpty(cost.vat) || this.equalToEmpty(cost.invoiceDate)) {
                    this.costCategory.find(x => x.type == "additionalCosts").isError = true;
                    validationExists = true;
                    return false;
                  }
                  newCost.push(cost);
                }
                else {
                  if (cost.costId > 0) {
                    if (this.notEqualToEmpty(cost.amountBrutto) || this.notEqualToEmpty(cost.vat) || this.notEqualToEmpty(cost.invoiceDate) || (this.notEqualToEmpty(cost.wageShareTypeId) || this.notEqualToEmpty(cost.wageShare))) {
                      newCost.push(cost);
                    }
                  }
                }
              }
            });
            element.cost = newCost;
          });
        }
      }
    });

    if (!validationExists) {
      this.costData = JSON.parse(JSON.stringify(newCostData))
    }
    return validationExists;
  }
  haveError(costType) {
    return this.costCategory.find(x => x.type == costType).isError;
  }
  wageShareIsMax(costType, conceptId, costId, name, i, x) {
    if (this.costData != null) {
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          let concept = this.costData.cost[costType][0].items
            .find((x) => x.conceptId == conceptId)
          let cost = concept
            .cost.find((x) => x.costId == costId);

          if (cost.wageShare > cost.amountBrutto && this.isErrorPossible(name, i, x, concept, cost)) {
            return true;
          }
          if (this.equalToEmpty(cost.wageShare) && this.notEqualToEmpty(cost.wageShareTypeId) && this.isErrorPossible(name, i, x, concept, cost)) {
            return true;
          }
          return false;
        }
      } else {
        if (this.costData.cost[costType] != null) {
          let concept = this.costData.cost[costType]
            .find((x) => x.conceptId == conceptId)
          let cost = concept
            .cost.find((x) => x.costId == costId);

          if ((cost.wageShare > cost.amountBrutto) && this.isErrorPossible(name, i, x, concept, cost)) {
            return true;
          }
          if (this.equalToEmpty(cost.wageShare) && this.notEqualToEmpty(cost.wageShareTypeId) && this.isErrorPossible(name, i, x, concept, cost)) {
            return true;
          }
          return false;
        }
      }
    }
    return false;
  }
  isWageShareTypeError(costType, conceptId, costId, name, i, x) {
    if (this.costData != null) {
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          let concept = this.costData.cost[costType][0].items
            .find((x) => x.conceptId == conceptId)
          let cost = concept
            .cost.find((x) => x.costId == costId);
          if (this.notEqualToEmpty(cost.wageShare) && this.equalToEmpty(cost.wageShareTypeId) && this.isErrorPossible(name, i, x, concept, cost)) {
            return true;
          }
          return false;
        }
      } else {
        if (this.costData.cost[costType] != null) {
          let concept = this.costData.cost[costType]
            .find((x) => x.conceptId == conceptId)
          let cost = concept
            .cost.find((x) => x.costId == costId);

          if (this.notEqualToEmpty(cost.wageShare) && this.equalToEmpty(cost.wageShareTypeId) && this.isErrorPossible(name, i, x, concept, cost)) {
            return true;
          }
          return false;
        }
      }
    }
    return false;
  }
  notEqualToEmpty(data) {
    if (data != null && data != "" && data != undefined) {
      return true;
    }
    else {
      return false;
    }

  }
  equalToEmpty(data) {
    if (data == null || data == "" || data == undefined) {
      return true;
    }
    else {
      return false;
    }
  }
}
