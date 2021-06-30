import { PropertyInfo } from '../../../shared/models/property-info.model';
import { ContactInformation } from '../models/contact-information.model';

export class GeneralSettingDetail {
  communicationMedium ? = [];
  notificationInd = true;
  emailPreference = '';
}

export class GeneralSettings {
  accountingDocument = new GeneralSettingDetail();
  readingdates = new GeneralSettingDetail();
  readingAttempt = new GeneralSettingDetail();
  plumbingDates = new GeneralSettingDetail();
  plumbingReports = new GeneralSettingDetail();
  remainingLetters = new GeneralSettingDetail();
  invoice = new GeneralSettingDetail();
  newInvoice = new GeneralSettingDetail();
  userNotAvailable = '';
  defectSmokeDetectors = '';
}

export class Member {
  userId: number;
  salutationCode = '';
  email = '';
  phone = '';
  fax = '';
  properties: PropertyInfo[] = [];
  startDateContracts?: string;
  endDateContracts?: string;
  name = '';
}

export class Profile {
  userId: number;
  generalSettings: GeneralSettings;
  contactInformation: ContactInformation;
  members: Member[] = [];
}
