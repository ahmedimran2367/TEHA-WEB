import { OfferProperty } from '../models/offerProperty';
import { OfferContact } from '../models/offerContact';
import { OfferRequestMeterTypes } from '../models/offerRequestMeterTypes';
export class OfferRequest {
    /**
     * Gets or sets user Id to enforce authorization
     * @value  User Id to enforce authorization
     */
    userId: number | null;

    /**Gets or Sets PropertyAddress */
    propertyAddress: OfferProperty = new OfferProperty();

    /**Gets or Sets ContactDetails */
    contactDetails: OfferContact = new OfferContact();

    /**
     * Gets or sets contract Type
     * @value  Contract Type
     */
    contractType: string[] = [];

    /**
     * Gets or sets types of services desired.
     * @value  Types of services desired.
     */
    serviceTypes: string[] = [];

    /**
     * Gets or sets meters which are requested/already available
     * @value  Meters which are requested/already available
     */
    meterTypes: OfferRequestMeterTypes[] = [];

    /**
     * Gets or sets user can select from these options as required: -No measuring device available -Devices already available -No measuring offer desired
     * @value  User can select from these options as required: -No measuring device available -Devices already available -No measuring offer desired
     */
    measuringDeviceRequirement = '';

    /**Gets or sets Comments */
    comments = '';
    /**Gets or sets terms Indicator */
    termsInd: boolean = null;
    /**Gets or sets confirm Indicator */
    confirmInd: boolean = null;
}
