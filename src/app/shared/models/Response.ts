export enum ResponseStatus {
  /// <summary>
  /// Success
  /// </summary>
  OK = 0,
  /// <summary>
  /// Error
  /// </summary>
  Error = 2,
  /// <summary>
  /// Info
  /// </summary>
  Info = 1,
  /// <summary>
  /// Warning
  /// </summary>
  Warning = 3,
  /// <summary>
  /// LimitExceeded
  /// </summary>
  LimitExceeded = 4,
  /// <summary>
  /// Forbidden
  /// </summary>
  Forbidden = 5,
  /// <summary>
  /// Unauthorized
  /// </summary>
  Unauthorized = 6,
  /// <summary>
  /// Bad Request
  /// </summary>
  BadRequest = 400,
}
// API Response
export interface Response {
  status: ResponseStatus;
  message: string;
  data: any;
}
