import { Order } from "./order";

export class OrderResponse
{
    /**Gets or Sets Items */
    items: Order[];

    /**
     * Gets or sets current pages
     * @value  Current pages
     */
    currentPage: number | null;

    /**
     * Gets or sets total records
     * @value  Total records
     */
    totalRecords: number | null;
}