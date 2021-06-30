import { PropertyInfo } from "../../../shared/models/property-info.model";

export class Contract {
    id: number;
    userId: number;
    propertyId: number;
    startTime: Date;
    endTime?: any;
    status: number;
    property: PropertyInfo;
    contractType: string;
}