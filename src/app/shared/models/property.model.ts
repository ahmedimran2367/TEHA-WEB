export class Property {
    id: number;
    tehaLgNo: string;
    adminLgNo: string;
    tehaDescription: string;
    adminDescription: string;
    street: string;
    postcode: string;
    place: string;
    latitude: number;
    longitude: number;
    flats?: any;
    generalMeters?: any;
    rwmStatus?: any;
    billingStatus?: any;
    readingStatus?: any;
    readings?: any;
    assemblyStatus?: any;
    plumbings?: any;
    billingPeriod?: any;
    dta?: any;
    openLetterInd: boolean;
    sepaDocumentInd?: any;
    openOrdersCount?: any;
    billingPeroidId: number;
}
