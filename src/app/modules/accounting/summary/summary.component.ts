import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FileName, FilePath } from 'src/app/shared/Constant/PDF';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountingService } from '../accounting.service';
import { Cost } from '../model/costData';
import { BillingCostConsumption, SummaryAndRelease } from '../model/summaryAndRelease';

export interface dataElement {
  concept: string;
  unit: string;
  consumption: string;
  amount: string;
  vat: string;
  date: string;
  comment: string;
}

const accounting_data: dataElement[] = [
  {
    concept: 'Natural Gas Tank',
    unit: '',
    consumption: '',
    amount: '',
    vat: '',
    date: '',
    comment: '',
  },
];

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  displayedColumns: string[] = [
    'concept',
    'unit',
    'consumption',
    'amount',
    'vat',
    'date',
    'comment',
  ];
  dataSource = accounting_data;
  steper = 1;
  summaryAndRelease: SummaryAndRelease;
  terms: any = {
    one: false,
    three: false,
  };
  readonlyInd: boolean = false;
  costData: any;
  comments: string = '';
  accountingSaveErrorMessage = '';
  @Output('openCostTab') openCostTab = new EventEmitter();
  @Input() costDataComp: any;
  @Input() options: any;
  constructor(
    private defaultDataService: DefaultDataService,
    public accoutingService: AccountingService,
    private translate: TranslateService,
    private toast: ToastService,
    private utilityService: UtilityService
  ) {

    this.summaryAndRelease = new SummaryAndRelease();
    this.accoutingService.costDataSubject.subscribe((u) => {
      if (u != null) {
        this.costData = JSON.parse(JSON.stringify(u));
      }
      this.readonlyInd =
        this.accoutingService.property.billingStatus == 'WAIT_DATA' &&
          this.accoutingService.property.dta == 'N' &&
          !this.accoutingService.flatData?.confirmTheCompletenessInd
          ? false
          : true;
    });
  }

  ngOnInit(): void {
    this.accoutingService.summaryStepper = 1;
    this.translate
      .get('accounting.accountingSaveErrorMessage')
      .subscribe((value) => {
        this.accountingSaveErrorMessage = value;
      });
    if (this.accoutingService.summaryAndRelease == null) {
      this.accoutingService
        .getSummaryAndReleaseInfo(
          this.accoutingService.property.billingPeroidId
        )
        .subscribe((res) => {
          if (
            res.data.alreadySavedInd == false &&
            this.accoutingService.lastPayrollYearId != 0
          ) {
            this.accoutingService
              .getSummaryAndReleaseInfo(this.accoutingService.lastPayrollYearId)
              .subscribe((response) => {
                this.summaryAndRelease = response.data;
                this.summaryAndRelease.billingInformation.heater = response.data.billingInformation.heater ?? new BillingCostConsumption();
                this.summaryAndRelease.billingInformation.hotWater = response.data.billingInformation.hotWater ?? new BillingCostConsumption();
                this.summaryAndRelease.consumptionAnalysis = null;
                this.accoutingService.summaryAndRelease = this.summaryAndRelease;
              });
          } else {
            this.summaryAndRelease = res.data;
            this.accoutingService.summaryAndRelease = this.summaryAndRelease;
          }
        });
    } else {
      this.summaryAndRelease = this.accoutingService.summaryAndRelease;
    }
  }
  submit(): void {
    if (this.steper == 1) {
      this.accoutingService.summaryStepper = 2;
      this.steper = 2;
    } else {

      if (this.isEnergyCostExists()) {
        this.summaryAndRelease.payrollYear = this.accoutingService.property.billingPeroidId;
        this.accoutingService
          .saveSummaryAndReleaseInfo(this.summaryAndRelease)
          .subscribe(
            (response) => {
              this.accoutingService.submit(this.comments).subscribe(
                (res) => {
                  this.steper = 3;
                },
                (err) => {
                  this.toast.openSnackError(this.accountingSaveErrorMessage);
                }
              );
            },
            (err) => {
              this.toast.openSnackError(this.accountingSaveErrorMessage);
            }
          );
      }
      else {
        this.translate
          .get('accounting.energyCostMandatoryError')
          .subscribe((value) => {
            this.toast.openSnackError(value);
          });

      }
    }
  }
  isEnergyCostExists() {
    let existsInd = false;
    if (this.costData != null) {
      this.costData.cost.energy.forEach(concept => {
        if (concept.cost.length > 0) {
          concept.cost.forEach(cost => {
            if ((this.notEqualToEmpty(cost.consumption)) || (this.notEqualToEmpty(cost.amountBrutto)) || (this.notEqualToEmpty(cost.vat)) || (this.notEqualToEmpty(cost.invoiceDate))) {
              existsInd = true;
            }
          });
        }
      });
    }
    return existsInd;
  }
  notEqualToEmpty(data) {
    if (data != null && data != "" && data != undefined) {
      return true;
    }
    else {
      return false;
    }

  }
  getTotal(costType, internal): any {
    let total = 0;
    if (this.costData != null) {
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          this.costData.cost[costType][0].items.forEach((element) => {
            if (element.cost != null) {
              element.cost.forEach((x) => {
                if (internal == null) {
                  total += x.amountBrutto;
                } else {
                  if (this.isInternal(element.conceptCode)) {
                    if (x.internalInd) {
                      total += x.amountBrutto;
                    }
                  } else {
                    if (!this.isInternal(element.conceptCode)) {
                      total += x.amountBrutto;
                    }
                  }
                }
              });
            }
          });
        }
      } else {
        if (this.costData.cost[costType] != null) {
          this.costData.cost[costType].forEach((element) => {
            if (element.cost != null) {
              element.cost.forEach((x) => {
                if (internal == null) {
                  total += x.amountBrutto;
                } else {
                  if (internal) {
                    if (this.isInternal(element.conceptCode)) {
                      total += x.amountBrutto;
                    }
                  } else {
                    if (!this.isInternal(element.conceptCode)) {
                      total += x.amountBrutto;
                    }
                  }
                }
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
  getCosts(costType, internalInd): any {
    const cost = [];
    if (this.costData != null) {
      if (costType == 'additionalCosts') {
        if (
          this.costData.cost[costType] != null &&
          this.costData.cost[costType][0].items != null
        ) {
          let i = 0;
          this.costData.cost[costType][0].items.forEach((element) => {
            if (element.cost != null) {
              i = 0;
              element.cost.forEach((costData) => {
                let x = JSON.parse(JSON.stringify(costData));

                x.conceptId = element.conceptId;
                x.parentEditInd = element.editableInd;
                x.costConcept = element.description;
                if (x.consumption != null) {
                  x.consumption = x.consumption.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                if (x.amountBrutto != null) {
                  x.amountBrutto = x.amountBrutto.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                if (x.vat != null) {
                  x.vat = x.vat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                if (x.wageShare != null) {
                  x.wageShare = x.wageShare.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                if (element.calculationKey != null) {
                  x.calculationKey = this.defaultDataService.DefaultData.lookUps.calculationKey.find(
                    (x) => x.code == element.calculationKey
                  ).value;
                }
                else {
                  x.calculationKey = "";
                }
                if (i == 0 && element.comments != null) {
                  x.parentComments = element.comments;
                }
                else {
                  x.parentComments = "";
                }
                i++;

                if (internalInd) {
                  if (this.isInternal(element.conceptCode)) {
                    cost.push(x);
                  }
                } else {
                  if (!this.isInternal(element.conceptCode)) {
                    cost.push(x);
                  }
                }
              });
            }
          });
        }
      } else {
        if (this.costData.cost[costType] != null) {
          let i = 0;
          this.costData.cost[costType].forEach((element) => {
            if (element.cost != null) {
              i = 0;
              element.cost.forEach((costData) => {
                let x = JSON.parse(JSON.stringify(costData));
                x.conceptId = element.conceptId;
                x.parentEditInd = element.editableInd;
                x.costConcept = element.description;
                if (i == 0 && element.comments != null) {
                  x.parentComments = element.comments;
                }
                else {
                  x.parentComments = "";
                }

                if (x.consumption != null) {
                  x.consumption = x.consumption.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                if (x.amountBrutto != null) {
                  x.amountBrutto = x.amountBrutto.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                if (x.vat != null) {
                  x.vat = x.vat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                if (x.wageShare != null) {
                  x.wageShare = x.wageShare.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                i++;
                x.parentUnits = element.units;
                if (internalInd) {
                  if (this.isInternal(element.conceptCode)) {
                    cost.push(x);
                  }
                } else {
                  if (!this.isInternal(element.conceptCode)) {
                    cost.push(x);
                  }
                }
              });
            }
          });
        }
      }
    }
    if (cost.length == 0) {
      cost.push({
        parentUnits: "-",
        costConcept: "-",
        costId: -1,
        units: "-",
        amountNetto: "-",
        vat: "-",
        consumption: "-",
        wageShare: "-",
        amountBrutto: "-",
        invoiceDate: "-",
        comments: "-",
        lastConsumption: "-",
        deleteInd: false
      })
    }
    else{
      this.addDashIfEmpty(cost);
    }
    return cost;
  }
  addDashIfEmpty(costs) {
    costs.forEach(cost => {
      if (this.equalToEmpty(cost.parentUnits)) {
        cost.parentUnits = "-";
      }
      if (this.equalToEmpty(cost.costConcept)) {
        cost.costConcept = "-";
      }
      if (this.equalToEmpty(cost.units)) {
        cost.units = "-";
      }
      if (this.equalToEmpty(cost.amountNetto)) {
        cost.amountNetto = "-";
      }
      if (this.equalToEmpty(cost.vat)) {
        cost.vat = "-";
      }
      if (this.equalToEmpty(cost.consumption)) {
        cost.consumption = "-";
      }
      if (this.equalToEmpty(cost.wageShare)) {
        cost.wageShare = "-";
      }
      if (this.equalToEmpty(cost.lastConsumption)) {
        cost.lastConsumption = "-";
      }
      if (this.equalToEmpty(cost.invoiceDate)) {
        cost.invoiceDate = "-";
      }
      if (this.equalToEmpty(cost.wageShare)) {
        cost.wageShare = "-";
      }
      if (this.equalToEmpty(cost.amountBrutto)) {
        cost.amountBrutto = "-";
      } if (this.equalToEmpty(cost.parentComments)) {
        cost.parentComments = "-";
      }
    });
  }
  equalToEmpty(data) {
    if (data == null || data == "" || data == undefined) {
      return true;
    }
    else {
      return false;
    }
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
  //remove extra costs which are added just for view rendering
  removeExtraCosts(): any {
    if (this.costData.cost.energy != null) {
      this.costData.cost.energy.forEach((element) => {
        const cost = [];
        if (element.cost != null) {
          element.cost.forEach((x) => {
            this.valueChange(x.consumption, element.conceptId, x.costId, 'energy', 'consumption');
            this.valueChange(x.vat, element.conceptId, x.costId, 'energy', 'vat');
            this.valueChange(x.amountBrutto, element.conceptId, x.costId, 'energy', 'amountBrutto');
            if (x.costId < 0) {
              if (x.consumption != null || x.vat != null || x.amountNetto != null) {
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
    if (this.costData.cost.heating != null) {
      this.costData.cost.heating.forEach((element) => {
        const cost = [];
        if (element.cost != null) {
          element.cost.forEach((x) => {
            this.valueChange(x.wageShare, element.conceptId, x.costId, 'heating', 'wageShare');
            this.valueChange(x.vat, element.conceptId, x.costId, 'heating', 'vat');
            this.valueChange(x.amountBrutto, element.conceptId, x.costId, 'heating', 'amountBrutto');


            if (!element.editableInd) {
              if (x.costId > 0) {
                cost.push(x);
              }
            } else {
              if (x.costId < 0) {
                if (x.wageShare != null || x.vat != null || x.amountNetto != null) {
                  cost.push(x);
                }
              } else {
                cost.push(x);
              }
            }
          });
          element.cost = cost;
        }
      });
    }
    if (this.costData.cost.additionalCosts[0].items != null) {
      this.costData.cost.additionalCosts[0].items.forEach((element) => {
        const cost = [];
        if (element.cost != null) {
          element.cost.forEach((x) => {
            this.valueChange(x.wageShare, element.conceptId, x.costId, 'additionalCosts', 'wageShare');
            this.valueChange(x.vat, element.conceptId, x.costId, 'additionalCosts', 'vat');
            this.valueChange(x.amountBrutto, element.conceptId, x.costId, 'additionalCosts', 'amountBrutto');
            if (!element.editableInd) {
              if (x.costId > 0) {
                cost.push(x);
              }
            } else {
              if (x.costId < 0) {
                if (x.wageShare != null || x.vat != null || x.amountNetto != null) {
                  cost.push(x);
                }
              } else {
                cost.push(x);
              }
            }
          });
          element.cost = cost;
        }
      });
    }
    if (this.costData.cost.hotWaterAdditional != null) {
      this.costData.cost.hotWaterAdditional.forEach((element) => {
        const cost = [];
        if (element.cost != null) {
          element.cost.forEach((x) => {
            this.valueChange(x.wageShare, element.conceptId, x.costId, 'hotWaterAdditional', 'wageShare');
            this.valueChange(x.vat, element.conceptId, x.costId, 'hotWaterAdditional', 'vat');
            this.valueChange(x.amountBrutto, element.conceptId, x.costId, 'hotWaterAdditional', 'amountBrutto');
            if (!element.editableInd) {
              if (x.costId > 0) {
                cost.push(x);
              }
            } else {
              if (x.costId < 0) {
                if (x.wageShare != null || x.vat != null || x.amountNetto != null) {
                  cost.push(x);
                }
              } else {
                cost.push(x);
              }
            }
          });
          element.cost = cost;
        }
      });
    }
    if (this.costData.cost.heatingAdditional != null) {
      this.costData.cost.heatingAdditional.forEach((element) => {
        const cost = [];
        if (element.cost != null) {
          element.cost.forEach((x) => {
            this.valueChange(x.wageShare, element.conceptId, x.costId, 'heatingAdditional', 'wageShare');
            this.valueChange(x.vat, element.conceptId, x.costId, 'heatingAdditional', 'vat');
            this.valueChange(x.amountBrutto, element.conceptId, x.costId, 'heatingAdditional', 'amountBrutto');
            if (!element.editableInd) {
              if (x.costId > 0) {
                cost.push(x);
              }
            } else {
              if (x.costId < 0) {
                if (x.wageShare != null || x.vat != null || x.amountNetto != null) {
                  cost.push(x);
                }
              } else {
                cost.push(x);
              }
            }
          });
          element.cost = cost;
        }
      });
    }
  }
  editCost(type, Id, conceptId): any {
    this.openCostTab.next();
    this.costDataComp.openCost({
      type: type,
      costId: Id,
      conceptId: conceptId,
    });
  }
  getTotalAmount(): any {
    let total = 0;
    if (this.costData != null) {
      if (this.costData.cost.energy != null) {
        this.costData.cost.energy.forEach((element) => {
          if (element.cost != null) {
            element.cost.forEach((x) => {
              total += x.amountBrutto;
            });
          }
        });
      }
      if (this.costData.cost.heating != null) {
        this.costData.cost.heating.forEach((element) => {
          if (element.cost != null) {
            element.cost.forEach((x) => {
              total += x.amountBrutto;
            });
          }
        });
      }
      if (this.costData.cost.additionalCosts[0].items != null) {
        this.costData.cost.additionalCosts[0].items.forEach((element) => {
          if (element.cost != null) {
            element.cost.forEach((x) => {
              total += x.amountBrutto;
            });
          }
        });
      }
      if (this.costData.cost.hotWaterAdditional != null) {
        this.costData.cost.hotWaterAdditional.forEach((element) => {
          if (element.cost != null) {
            element.cost.forEach((x) => {
              total += x.amountBrutto;
            });
          }
        });
      }
      if (this.costData.cost.heatingAdditional != null) {
        this.costData.cost.heatingAdditional.forEach((element) => {
          if (element.cost != null) {
            element.cost.forEach((x) => {
              total += x.amountBrutto;
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
  isSmokeDetectorExists(): any {
    let isSmokeDetectorExist = false;
    if (this.costData.cost.additionalCosts[0].items != null) {
      this.costData.cost.additionalCosts[0].items.forEach((element) => {
        if (Number(element.conceptCode) == 308) {
          isSmokeDetectorExist = true;
        }
      });
    }
    return isSmokeDetectorExist;
  }
  isRepairsExists(): any {
    let isRepairsExist = false;
    if (this.costData.cost.additionalCosts[0].items != null) {
      this.costData.cost.additionalCosts[0].items.forEach((element) => {
        if (Number(element.conceptCode) == 820) {
          isRepairsExist = true;
        }
      });
    }
    return isRepairsExist;
  }
  valueChange(value, conceptId, costId, costType, field) {
    if (this.costData != null) {
      if (costType == "additionalCosts") {
        if (this.costData.cost[costType] != null && this.costData.cost[costType][0].items != null) {
          let cost = this.costData.cost[costType][0].items.find(x => x.conceptId == conceptId).cost.find(x => x.costId == costId);
          if (cost != null) {
            if (value != null) {
              cost[field] = value.toString().replace(".", ",")
            }
          }
        }
      }
      else {
        if (this.costData.cost[costType] != null) {
          let cost = this.costData.cost[costType].find(x => x.conceptId == conceptId).cost.find(x => x.costId == costId);
          if (cost != null) {
            if (value != null) {
              cost[field] = value.toString().replace(".", ",")
            }
          }
        }
      }
    }
  }
  downloadPDF(): void {
    this.downloadFile(FileName.commonPDF, FilePath.commonPDF);
  }
  downloadFile(name, path): void {
    const link = document.createElement('a');
    link.download = name;
    link.href = path;
    link.click();
  }
  changeStepper(val) {
    this.steper = val;
  }
}
