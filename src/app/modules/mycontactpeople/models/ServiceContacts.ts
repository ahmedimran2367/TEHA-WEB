/** Service Contacts */
export class ServiceContacts {
  /** Gets or Sets General Contact Persons */
  general: ServiceContactInfo;

  /** Gets or Sets PlumbingAndMeasuringEquipment Contact Persons */
  plumbingAndMeasuringEquipment: ServiceContactInfo;

  /** Gets or Sets Accounting Contact Persons */
  accounting: ServiceContactInfo;

  /** Gets or Sets Readings Contact Persons */
  readings: ServiceContactInfo;

  /** Gets or Sets OffersAndContracts Contact Persons */
  offersAndContracts: ServiceContactInfo;

  /** Gets or Sets DrinkingWater Contact Persons */
  drinkingWater: ServiceContactInfo;

  /** Gets or Sets EnergyPerformanceCertificate Contact Persons */
  energyPerformanceCertificate: ServiceContactInfo;
}

/** Contains contact person details */
export interface ServiceContactInfo {
  /**
   * Gets or sets peron name who&#x27;s serves that respected service request.
   * @value  Peron name who&#x27;s serves that respected service request.
   */
  name: string;

  /**
   * Gets or sets email address of the contact persion.
   * @value  Email address of the contact persion.
   */
  email: string;

  /**
   * Gets or sets tel Number
   * @value  Tel Number
   */
  phone: string;

  // Office Hours
  officeHours: string;
}
