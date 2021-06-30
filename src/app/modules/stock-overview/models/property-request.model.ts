export class Sort {
    by: string;
    direction: string;
}

export class PropertyRequest {
    userId: number;
    propertyIds: any[];
    freeText: string;
    rwmStatus: string;
    accountingStatus: string;
    plumbingStatus: string;
    readingStatus: string[];
    accountingMonth?: number;
    dta?: any;
    pageNo: number;
    pageSize: number;
    sort: Sort;
    includeChildren: boolean;
    payrollClosingYear: string;
}
