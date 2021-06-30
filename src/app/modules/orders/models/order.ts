export class Order {
    /**
     * Gets or sets order ID
     * @value  Order ID
     */
    id: number | null;

    /**Gets or sets user Id */
    userId: number;
    /**Gets or sets property Id */
    propertyId: number;
    /**Gets or sets flat Id */
    flatId: number;

    /**
     * Gets or sets teha Lg No
     * @value  Teha Lg No
     */
    tehaLgNo: string;

    /**
     * Gets or sets admin Lg No
     * @value  Admin Lg No
     */
    adminLgNo: string;

    /**
     * Gets or sets teha User No
     * @value  Teha User No
     */
    tehaUserNo: string;

    /**
     * Gets or sets admin User No
     * @value  Admin User No
     */
    adminUserNo: string;


    /**
     * Gets or sets description
     * @value  Description
     */
    description: string;

    /**
     * Gets or sets creationDate
     * @value  Creation Date of Order
     */
    creationDate: string;

    /**
     * Gets or sets contains order type
     * @value  Contains order type
     */
    type: string;

    /**
     * Gets or sets status
     * @value  status
     */
    status: string;
}
