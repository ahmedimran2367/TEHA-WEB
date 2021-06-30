export class SummaryAndRelease {
  constructor() {
    this.siftChargesFor = new SiftChargesFor();
    this.billingInformation = new BillingInformation();
  }
  userId: number;
  propertyId: number;
  payrollYear: number;
  consumptionAnalysis: boolean;
  siftChargesFor: SiftChargesFor;
  billingInformation: BillingInformation;
  alreadySavedInd: boolean;
}

export class SiftChargesFor {
  smokeDetector: boolean | null;
  userChange: boolean | null;
  repair: boolean | null;
}

export class BillingInformation {
  constructor() {
    this.heater = new BillingCostConsumption();
    this.hotWater = new BillingCostConsumption();
  }
  averageBoilerTemprature: number | null;
  heater: BillingCostConsumption;
  hotWater: BillingCostConsumption;
}
export class BillingCostConsumption {
  basicCost: number;
  consumption: number;
}
