import { FileContentResponse } from '../../accounting/model/costData';

export class ThermalEnergy {
    period: string;
    amount: number;
    unit: string;
    vacancyPercentage: number;
}

export class HotWater {
    period: string;
    amount: number;
    unit: string;
}

export class OrderEnergyPerformanceRequest {
    orderId: number;
    userId: number;
    propertyId: number;
    buildingType: string;
    yearOfConstruction: string;
    monumentProtectionInd: boolean;
    amountOfHotWaterUsed: number;
    measurmentWithWWZInd: boolean;
    renewalOfHeating: string;
    buildingCooledInd: boolean;
    heatableUsableArea: number;
    noOfResidentialUnits: number;
    buildingWithBasement: string;
    basementHeatedInd: boolean;
    heatingSystem: string;
    energySource: string;
    facadeInsulationYear: string;
    roofInsulationYear: string;
    solarSystemYear: string;
    thermalEnergy: ThermalEnergy[] = [];
    hotWater: HotWater[] = [];
    hotWaterIncludedInd: boolean;
    yearOfHeating: string;
    renovationWindowsYear: string;
    insulationCeilingYear: string;
    hotWaterTemperature: string;
    termsInd: boolean;
    costsInd: boolean;
    dataProtectionInd: boolean;
    imagesContents: FileContentResponse[] = [];
    airConditionerInd: boolean;
    nextServiceDate: string;

}
export class Periods {
    startDate: Date;
    endDate: Date;
}
