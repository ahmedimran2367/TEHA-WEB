export class OfferContact {
    /**
     * Gets or sets salutationCode
     * @value  Salutation of the owner
     */
    salutationCode: string;
    /**
     * Gets or sets name of the owner
     * @value  Name of the owner
     */
    firstName: string;

    /**
     * Gets or sets last Name
     * @value  Last Name
     */
    lastName: string;

    /**
     * Gets or sets house Number
     * @value  House Number
     */
    houseNumber: string;

    /**
     * Gets or sets street in which the person lives
     * @value  Street in which the person lives
     */
    street: string;

    /**
     * Gets or sets postal Code of the person&#x27;s area
     * @value  Postal Code of the person&#x27;s area
     */
    postcode: string;

    /**
     * Gets or sets city of the Person
     * @value  City of the Person
     */
    place: string;

    /**
     * Gets or sets phone Number
     * @value  Phone Number
     */
    phone: string;

    /**
     * Gets or sets email
     * @value  Email
     */
    email: string;

    /**
     * Gets or sets type of contact person, i.e., Owner, Property Manager or Other
     * @value  Type of contact person, i.e., Owner, Property Manager or Other
     */
    type: string;

    /**
     * Gets or sets if the selected type is Óther, then user will enter this description
     * @value  If the selected type is Óther, then user will enter this description
     */
    otherTypeDescription: string;
}
