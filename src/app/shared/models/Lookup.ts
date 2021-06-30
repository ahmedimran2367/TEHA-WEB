export class LookUps
{
    code: string;
    value: string;
    status: boolean | null;
    sortOrder: number | null;
}

export class LookupBase
{
    communicationChannel: LookUps[];
    contractType: LookUps[];
    measuringInstrumentType: LookUps[];
    testType: LookUps[];
    plumbingReason: LookUps[];
    buildingType: LookUps[];
    energySource: LookUps[];
    costCategory: LookUps[];
    heatingCostType: CostLookUp[];
    energyCostType: CostLookUp[];
    energyCostTypeUnit: LookUps[];
    houseCostType: CostLookUp[];
    documentType: LookUps[];
    serviceType: LookUps[];
    additionalHeatingCostType: CostLookUp[];
    additionalHotWaterCostType: CostLookUp[];
    rwmStatus: LookUps[];
    readingStatus: LookUps[];
    plumbingStatus: LookUps[];
    accountingStatus: LookUps[];
    measurementUnit: LookUps[];
    orderStatus: LookUps[];
    orderType: LookUps[];
    location: LookUps[];
    extractionpoints: LookUps[];
    calculationKey: LookUps[];
    salutation: LookUps[];
    wageShareType: LookUps[];
}

export class EnergyCostLookup
{
    code: string;
    value: string;
    unit: string;
    status: boolean | null;
    sortOrder: number | null;
}

export class CostLookUp
{
    code: string;
    value: string;
    status: boolean | null;
    internalInd: boolean;
    sortOrder: number | null;
}
