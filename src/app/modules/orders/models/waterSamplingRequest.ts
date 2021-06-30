export class WaterSamplingRequest {
    /**
     * Gets or sets user Id to enforce authorization
     * @value  User Id to enforce authorization
     */
    userId: number | null;

    /**
     * Gets or sets property Id
     * @value  Property Id
     */
    propertyId: number | null;

    /**
     * Gets or sets any notes or comments added by the User.
     * @value  Any notes or comments added by the User.
     */
    comments: string;

    /**
     * Gets or sets always be true. Terms &amp; conditions and cancellation policy
     * @value  Always be true. Terms &amp; conditions and cancellation policy
     */
    termsInd: boolean | null;

    /**
     * Gets or sets always be true. Bear the costs, provided that the measuring
     *  device is not defective or there is no warranty claim
     * @value  Always be true. Bear the costs, provided that the
     *  measuring device is not defective or there is no warranty claim
     */
    costsInd: boolean | null;

    /**
     * Gets or sets always be true. Declaration on data protection and agree
     *  to the storage of data for the period until the purpose is fulfilled
     * @value  Always be true. Declaration on data protection and agree
     *  to the storage of data for the period until the purpose is fulfilled
     */
    dataProtectionInd: boolean | null;

    /**Gets or Sets Question */
    questions: Questions;
}

/**Contains questions answers */
export class Questions {
    /**Gets or sets a value indicating whether gets or Sets StorageVolume400 */
    storageVolume400: boolean;

    /**Gets or sets a value indicating whether gets or Sets LineContent3L */
    lineContent3L: boolean;

    /**Gets or sets a value indicating whether gets or Sets InspectionInAdvance */
    inspectionInAdvance: boolean;

    /**Gets or Sets Tap */
    tap: string;

    /**Gets or Sets DrinkingWaterExtractionPoint */
    drinkingWaterExtractionPoint: DrinkingWaterExtractionPoint[];
}

/**Contains flat wise location of Drinking Water Extraction Points */
export class DrinkingWaterExtractionPoint {
    /**Gets or Sets Flat ID */
    flatId: number;

    /**Gets or Sets locations */
    location: string[];
}
