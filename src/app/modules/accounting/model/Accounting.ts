/// <summary>
/// All possible parameters can we used to search across application.
/// </summary>
export class AccountingRequest {
  /// <summary>
  /// Gets or sets user ID
  /// </summary>
  userId: number;
  /// <summary>
  /// Gets or sets list of property IDs.
  /// </summary>
  propertyIds: any[];
  /// <summary>
  /// Gets or sets free text search
  /// </summary>
  freeText: string;
  /// <summary>
  /// Gets or sets Accounting Status Filter
  /// </summary>
  accountingStatus: string;
  /// <summary>
  /// Gets or sets Accounting Month.
  /// </summary>
  accountingMonth?: number;
  /// <summary>
  /// Gets or sets data Medium ExchangeS status for Accounting. A is for Activated and N is for NOT Activated
  /// </summary>
  dta: string;
  /// <summary>
  /// Gets or Sets PageNo
  /// </summary>
  pageNo: number;
  /// <summary>
  /// Gets or sets page size for paging
  /// </summary>
  pageSize: number;
  /// <summary>
  /// Gets or Sets Sort
  /// </summary>
  sort?: any;
  /// <summary>
  /// Gets or Sets payrollClosingYear
  /// </summary>
  payrollClosingYear: string;
}
/// <summary>
/// Property Result
/// </summary>
export class AccountingResult {
  /// <summary>
  /// Gets or sets list of properties.
  /// </summary>
  items: any[];
  /// <summary>
  /// Gets or sets current pages
  /// </summary>
  currentPage: number;
  /// <summary>
  /// Gets or sets total records
  /// </summary>
  totalRecords: number;
}
