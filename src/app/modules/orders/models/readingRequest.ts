export class ReadingRequest {

  /**Gets or Sets OrderId */
  orderId: number | null;

  /**Gets or Sets UserId */
  userId: number | null;

  /**Gets or Sets PropertyId */
  propertyId: number | null;

  /**Gets or Sets FlatId */
  flatId: number | null;

  /// <summary>
  /// Gets or sets Meter Ids to request Reading for.
  /// </summary>
  meterIds: number[];

  /// <summary>
  /// Gets or sets user should be able to pick a future date when a new user is coming in
  /// </summary>
  /// <value>User should be able to pick a future date when a new user is coming in</value>
  // dateOfChangeOfUser :Date |null

  /// <summary>
  /// Gets or sets date of Appointment
  /// </summary>
  /// <value>Date of Appointment</value>
  appointmentDate: Date | null;

  /// <summary>
  /// Gets or Sets AlternativeDateRange
  /// </summary>
  alternativeDateRange: DateRange;

  /// <summary>
  /// Gets or Sets PreferredTimeRange
  /// </summary>
  preferredTimeRange: TimeRange;

  /// <summary>
  /// Gets or Sets CommunicationMode
  /// </summary>
  communicationMode: CommunicationMode;

  /// <summary>
  /// Gets or Sets UserMovingOut
  /// </summary>
  userMovingOut: UserMovingOut;

  /// <summary>
  /// Gets or Sets UserMovingIn
  /// </summary>
  userMovingIn: UserMovingIn;

  /// <summary>
  /// Gets or sets always be true. Terms &amp; conditions and cancellation policy
  /// </summary>
  /// <value>Always be true. Terms &amp; conditions and cancellation policy</value>
  termsInd: boolean;

  /// <summary>
  /// Gets or sets always be true. Bear the costs, provided that the measuring device is not defective or there is no warranty claim
  /// </summary>
  /// <value>Always be true. Bear the costs, provided that the measuring device is not defective or there is no warranty claim</value>
  costsInd: boolean;

  /// <summary>
  /// Gets or sets always be true. Declaration on data protection and agree to the storage of data for the period until the purpose is fulfilled
  /// </summary>
  /// <value>Always be true. Declaration on data protection and agree to the storage of data for the period until the purpose is fulfilled</value>
  dataProtectionInd: boolean;
}

export class UserMovingIn {

  /// <summary>
  /// Gets or sets salutationCode
  /// </summary>
  /// <value>Salutation</value>
  salutationCode: string;

  /// <summary>
  /// Gets or sets FirstName
  /// </summary>
  /// <value>FirstName</value>
  firstName: string;

  /// <summary>
  /// Gets or sets LastName
  /// </summary>
  /// <value>LastName</value>
  lastName: string;

  /// <summary>
  /// Gets or sets Date
  /// </summary>
  /// <value>Date</value>
  date: Date | null;

  /// <summary>
  /// Gets or sets phone
  /// </summary>
  /// <value>Phone</value>
  phone: string;

  /// <summary>
  /// Gets or sets mobile
  /// </summary>
  /// <value>Mobile</value>
  mobile: string;

  /// <summary>
  /// Gets or sets email
  /// </summary>
  /// <value>email</value>
  email: string;
}

export class UserMovingOut {

  /// <summary>
  /// Gets or sets salutationCode
  /// </summary>
  /// <value>Salutation</value>
  salutationCode: string;

  /// <summary>
  /// Gets or sets FirstName
  /// </summary>
  /// <value>FirstName</value>
  firstName: string;

  /// <summary>
  /// Gets or sets LastName
  /// </summary>
  /// <value>LastName</value>
  lastName: string;

  /// <summary>
  /// Gets or sets Date
  /// </summary>
  /// <value>Date</value>
  date: Date | null;

  /// <summary>
  /// Gets or sets phone
  /// </summary>
  /// <value>Phone</value>
  phone: string;

  /// <summary>
  /// Gets or sets mobile
  /// </summary>
  /// <value>Mobile</value>
  mobile: string;

  /// <summary>
  /// Gets or sets email
  /// </summary>
  /// <value>email</value>
  email: string;
}

export class CommunicationMode {
  /// <summary>
  /// Gets or sets FirstName
  /// </summary>
  /// <value>FirstName</value>
  letterInd: boolean | null;

  /// <summary>
  /// Gets or sets LastName
  /// </summary>
  /// <value>LastName</value>
  smsInd: boolean | null;

  /// <summary>
  /// Gets or sets Date
  /// </summary>
  /// <value>Date</value>
  emailInd: boolean | null;

  /// <summary>
  /// Gets or sets phone
  /// </summary>
  /// <value>Phone</value>
  webPortalInd: boolean | null;

}
export class DateRange {
  /// <summary>
  /// Gets or sets start Date/Time
  /// </summary>
  /// <value>Start Date/Time</value>
  from: string | null;

  /// <summary>
  /// Gets or sets end Date/Time
  /// </summary>
  /// <value>End Date/Time</value>
  to: string | null;
}

export class TimeRange {
  /// <summary>
  /// Gets or sets start Date/Time
  /// </summary>
  /// <value>Start Date/Time</value>
  from: string;

  /// <summary>
  /// Gets or sets end Date/Time
  /// </summary>
  /// <value>End Date/Time</value>
  to: string;
}
