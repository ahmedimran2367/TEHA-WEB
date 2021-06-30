export class OfferProperty {
    /**Gets or Sets HouseNumber */
    houseNumber: string;

    /**
     * Gets or sets street of the building
     * @value  Street of the building
     */
    street: string;

    /**
     * Gets or sets postal Code of the area in which the building is.
     * @value  Postal Code of the area in which the building is.
     */
    postcode: string;

    /**
     * Gets or sets city of the building
     * @value  City of the building
     */
    place: string;

    /**
     * Gets or sets type of the property, i.e., Resedential, Commercial or Resedential and Commercial
     * @value  Type of the property, i.e., Resedential, Commercial or Resedential and Commercial
     */
    type: string;

    /**
     * Gets or sets apparment count
     * @value  Apparment count
     */
    appartmentCount: number | null;

    /**
     * Gets or sets commercial Units count in case of commercial property
     * @value  Commercial Units count in case of commercial property
     */
    commercialUnitCount: number | null;
}
