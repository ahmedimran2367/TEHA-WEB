export class OrderRequest {
    constructor() {
        this.sort = new Sort();
    }

    /**Gets or Sets UserId */
    userId: number | null;

    /**Gets or Sets PropertyId */
    propertyId: number | null;

    /**Gets or Sets FlatId */
    flatId: number | null;

    /**Gets or Sets Status */
    status: string[] = [];

    /**Gets or Sets type */
    type: string[] = [];

    /**
     * Gets or sets teha LG Number
     * @value  Teha LG Number
     */
    tehaLgNo: string;

    /**
     * Gets or sets admin LG Number
     * @value  Admin LG Number
     */
    adminLgNo: string;

    /**
     * Gets or sets teha User Number
     * @value  Teha User Number
     */
    tehaUserNo: string;

    /**
     * Gets or sets admin User Number
     * @value  Admin User Number
     */
    adminUserNo: string;

    /**Gets or Sets PageNo */
    pageNo: number | null;

    /**
     * Gets or sets page size for paging
     * @value  Page size for paging
     */
    pageSize: number | null;

    // Free form text
    freeText: string | null;

    /**Gets or Sets Sort */
    sort: Sort;
}

export class Sort {
    by: string;
    direction: string;
}
