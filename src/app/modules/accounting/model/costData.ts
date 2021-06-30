export class CostData {
  /// <summary>
  /// Gets or sets user ID
  /// </summary>
  userId: number;
  /// <summary>
  /// Gets or sets property ID
  /// </summary>
  propertyId: number;
  /// <summary>
  /// Gets or sets payroll Year
  /// </summary>
  payrollYear: number;
  /// <summary>
  /// Gets or Sets Cost
  /// </summary>
  cost: Cost;
  /// <summary>
  /// Gets or sets a value indicating whether gets or sets i have read and understood the terms and conditions and the cancellation policy.
  /// </summary>
  cancellationPolicyInd: boolean;
  /// <summary>
  /// Gets or sets a value indicating whether gets or sets i hereby confirm the completeness of the data.
  /// </summary>
  confirmTheCompletenessInd: boolean;
  /// <summary>
  /// Gets or sets a value indicating whether gets or sets the order of the individual cost categories
  /// is subject to a fee. The prices can be taken from the price list.
  /// </summary>
  subjectToFeeInd: boolean;
  /// <summary>
  /// Gets or sets Updated Date
  /// </summary>
  updatedDate: string;
}
/// <summary>
/// Contains Costing Detail by types
/// </summary>
export class Cost {
  /// <summary>
  /// Gets or Sets Energy
  /// </summary>
  energy: Array<CostConcept>;
  /// <summary>
  /// Gets or sets list of heating cost.
  /// </summary>
  heating: Array<CostConcept>;
  /// <summary>
  /// Gets or Sets Heating Additional cost list
  /// </summary>
  heatingAdditional: Array<CostConcept>;
  /// <summary>
  /// Gets or sets list of Hot Water additional cost.
  /// </summary>
  hotWaterAdditional: Array<CostConcept>;
  /// <summary>
  /// Gets or sets list of Additional costs.
  /// </summary>
  additionalCosts: AdditionalCost;
}
/// <summary>
/// Cost Concept
/// </summary>
export class CostConcept {
  /// <summary>
  /// Gets or sets concept Id
  /// </summary>
  conceptId: number;

  /// <summary>
  /// Gets or sets property Id
  /// </summary>
  propertyId;

  /// <summary>
  /// Gets or sets payrollYear Id
  /// </summary>
  payrollYearId;

  /// <summary>
  /// Gets or sets concept Code
  /// </summary>
  conceptCode: number | null;
  /// <summary>
  /// Gets or sets vat
  /// </summary>
  vat: number | null;
  /// <summary>
  /// Gets or sets description
  /// </summary>
  description: string;
  /// <summary>
  /// Gets or sets cost Concept Spliting Type
  /// </summary>
  splittingType: string;
  /// <summary>
  /// Gets or sets total Amount Last Period
  /// </summary>
  totalAmountLastPeriod: number | null;
  /// <summary>
  /// Gets or sets if true, then concept is edit able.
  /// </summary>
  editableInd: boolean;
  /// <summary>
  /// Gets or sets list of cost
  /// </summary>
  cost: Array<CostDetail> | null;
  /// <summary>
  /// Gets or sets contains Quantities of energy cost
  /// </summary>
  quantities: EnergyCostQuantity | null;
  /// <summary>
  /// Gets or sets CalculationKey
  /// </summary>
  calculationKey: string;
  /// <summary>
  /// Gets or sets measurement Unit
  /// </summary>
  units: string | null;
  // <summary>
  /// Gets or sets comments
  /// </summary>
  comments: string;
  // <summary>
  /// Gets or sets delete indicator
  /// </summary>
  deleteInd: boolean;
  /// <summary>
  /// Gets or sets a value indicating whether gets or sets Internal Indicator
  /// </summary>
  internalInd: boolean | null ;
  
}
/// <summary>
/// Contains costing details
/// </summary>
export class CostDetail {
    /// <summary>
    /// Gets or sets cost Id
    /// </summary>
    costId: number;
    /// <summary>
    /// Gets or sets measurement Unit
    /// </summary>
    units: string | null ;
    /// <summary>
    /// Gets or sets amount Netto
    /// </summary>
    amountNetto: number | null ;
    /// <summary>
    /// Gets or sets Vat Percentage
    /// </summary>
    vat: number | null ;
    /// <summary
    /// Gets or sets current consumption
    /// </summary>
    consumption: number | null ;
    /// <summary>
    /// Gets or sets wage Share %
    /// </summary>
    wageShare:number | null ;
    /// <summary>
    /// Gets or sets amount Brutto
    /// </summary>
    amountBrutto: number | null ;
    /// <summary>
    /// Gets or sets invoice Date
    /// </summary>
    invoiceDate: string;
    /// <summary>
    /// Gets or sets comments
    /// </summary>
    comments: string;
    /// <summary>
    /// Gets or sets invoice File Contents
    /// </summary>
    invoiceFileContents: FileContentResponse[] = [];
    /// <summary>
    /// Gets or sets a value indicating whether gets or sets Editable Indicator. If true, cost will be edit able.
    /// </summary>
    editableInd: boolean | null ;
    /// <summary>
    /// Gets or sets a value indicating whether gets or sets Internal Indicator
    /// </summary>
    internalInd: boolean | null ;
    /// <summary>
    /// Gets or sets last year consumption
    /// </summary>
    lastConsumption: number | null ;
    /// <summary>
    /// Gets or sets Wage Share Type Id
    /// </summary>
    wageShareTypeId: string;
    // <summary>
    /// Gets or sets delete indicator
    /// </summary>
    deleteInd: boolean;
}
/// <summary>
/// FileContentResponse Model
/// </summary>
export class FileContentResponse {
  /// <summary>
  /// Gets or Sets Filename
  /// </summary>
  filename: string;
  /// <summary>
  /// Gets or Sets Content of the file
  /// </summary>
  content: string;
}
/// <summary>
/// Contains Quantities of energy cost
/// </summary>
export class EnergyCostQuantity {
  /// <summary>
  /// Gets or Sets Opening Quantity
  /// </summary>
  openingQuantity: number;
  /// <summary>
  /// Gets or Sets Closing Quantity
  /// </summary>
  closingQuantity: number;
  /// <summary>
  /// Gets or Sets Opening Amount
  /// </summary>
  openingAmount: number;
}
/// <summary>
/// Contains Energy Cost
/// </summary>
export class AdditionalCost {
  /// <summary>
  /// Gets or sets contains list of energy cost
  /// </summary>
  items: Array<CostConcept>;
  /// <summary>
  /// Gets or sets opening Balance (Quantity)
  /// </summary>
  waterConsumption: number | null;
  /// <summary>
  /// Gets or sets closing Stock (Quantity)
  /// </summary>
  wastewater: number | null;
  /// <summary>
  /// Gets or sets opening Balance (Gross Amount)
  /// </summary>
  generalElectricityInd: number | null;
}
