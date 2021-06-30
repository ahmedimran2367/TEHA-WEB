import { DateRange, TimeRange, CommunicationMode } from '../models/readingRequest';
import { ContactPerson } from '../models/smokeDetectorRequest';

export class OrderReadingRequest {
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
  meterId: number;

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
  alternativePerson: ContactPerson;

  /// <summary>
  /// Gets or Sets reason
  /// </summary>
  // reason :string

  /// <summary>
  /// Gets or Sets reason
  /// </summary>
  comments: string;

   /// <summary>
  /// Gets or Sets telephone
  /// </summary>
  phone: string;

    /// <summary>
  /// Gets or Sets email
  /// </summary>
  email: string;

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
