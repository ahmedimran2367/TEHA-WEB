import { CommunicationMode, DateRange, TimeRange } from './readingRequest';

export class AlternativePerson {
    salutationCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    mobile: string;
}


export class OrderPlumbingRequest {
    userId: number;
    propertyId: number;
    flatId: number;
    meterIds = [];
    email: string;
    phone: string;
    alternativePerson = new AlternativePerson();
    appointmentDate: string;
    alternativeDateRange = new DateRange();
    preferredTimeRange = new TimeRange();
    reason: string;
    communicationMode = new CommunicationMode();
    comments: string;
    termsInd: boolean;
    costsInd: boolean;
    dataProtectionInd: boolean;
}
