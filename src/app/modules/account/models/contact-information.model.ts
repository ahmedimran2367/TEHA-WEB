export class ContactInformation {
    salutationCode: string;
    firstName: string;
    lastName: string;
    phone: string;
    mobile: string;
    email: string;
    additionalEmails: AdditionalEmail[] = [];
    fax: string;
    customerNumber: string;
    street: string;
    postcode: string;
    place: string;
    latitude: number;
    longitude: number;
    secondaryStreet: string;
    secondaryPostcode: string;
    secondaryPlace: string;
    secondaryEmail: string;
    sameAddressInd: boolean;
    sameEmailInd: boolean;
    secondaryFirstName: string;
    secondaryLastName: string;
    secondarySalutationCode: string;
}
export class AdditionalEmail {
    email = '';
    enableNotificationInd = false;
}
