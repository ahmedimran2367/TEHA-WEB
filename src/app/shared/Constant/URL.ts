export class Url {
  /** meters measurs */
  static constStockOverviewGet = '/api/StockOverview/Get';

  /** All meters */
  static constStockOverviewGetAllMeters = '/api/StockOverview/GetAllMeters';

  /** Stock Overview Summary */
  static constStockOverviewSummary = '/api/StockOverview/GetSummary';

  /** Stock Overview Properties */
  static constStockOverviewProperties = '/api/StockOverview/GetProperties';

  /** Stock Overview Get Flats */
  static constStockOverviewGetFlats = '/api/StockOverview/GetFlats';

  /** Stock Overview Get Open Letter */
  static constStockOverviewGetOpenLetter = '/api/StockOverview/GetOpenLetter';

  /** Athentication */
  static constAccountLogin = '/api/Account/Authenticate';

  /** Athentication */
  static constAccountGetNewRefreshToken = '/api/Account/GetNewRefreshToken';

  /** Accounting Get */
  static AccountingGetAccountingPeriods =
    '/API/Accounting/GetAccountingPeriods';

  /** Accounting Get */
  static constAccountingGet = '/api/Accounting/Get';

  /** Accounting Get Flat Current User Info */
  static constAccountingGetFlatUsers = '/api/Accounting/GetFlatUsers';

  /** Accounting Get Cost Data */
  static constAccountingGetCost = '/api/Accounting/GetCosts';

  /** Accounting Get Cost Data */
  static constAccountingSaveCost = '/api/Accounting/SaveCosts';

  // Get Summary And Release Info
  static constAccountingGetSummaryAndReleaseInfo =
    '/api/Accounting/GetSummaryAndReleaseInfo';

  // save flat user
  static constAccountingSaveFlatUsers = '/api/Accounting/SaveFlatUsers';

  /** Accounting Submit */
  static constAccountingSubmit = '/api/Accounting/Submit';

  /** Accounting Submit */
  static constAccountingDeleteCost = '/api/Accounting/DeleteCost';

  /** Accounting  Get Last Updated Dates */
  static constGetLastUpdatedDates = '/api/Accounting/GetLastUpdatedDates';

  static contSetSummaryAndReleaseInfo =
    '/api/Accounting/SetSummaryAndReleaseInfo';

  /** Athentication */
  static constUserContactInformation = '/api/Account/GetUserContactInformation';

  /** Get All Documents with type */
  static constDocumentArchivesAll = '/api/DocumentArchives/GetDocuments';

  /** Get Invoices */
  static constDocumentArchivesGetInvoices = '/api/DocumentArchives/GetInvoices';

  /** Get Document content */
  static constDocumentArchivesGetContent =
    '/api/DocumentArchives/GetDocumentContent';

  /** Get SEPA document */
  static constDocumentArchivesGetSEPA = '/api/DocumentArchives/GetSEPADocument';

  /** Get All SEPA documents */
  static constDocumentArchivesAllSEPA =
    '/api/DocumentArchives/GetAllSEPADocuments';

  /** Get All SEPA documents */
  static constDocumentArchivesGetAccountingDocumentByFlat =
    '/api/DocumentArchives/GetAccountingDocumentByFlat';

  /** Get All SEPA documents */
  static constDocumentArchivesGetAccountingFlatDocumentContent =
    '/api/DocumentArchives/GetAccountingFlatDocumentContent';

  /** Order Send Request for plumbing */
  static constOrderRequestPlumbing = '/api/Order/RequestPlumbing';

  /** Order Send Request for Reading */
  static constOrderRequestReading = '/api/Order/RequestReading';

  /** Order Send Request for SmokeDetectorTest */
  static constOrderRequestSmokeDetectorTest =
    '/api/Order/RequestSmokeDetectorTest';

  /** Order Send Request for RequestOffer */
  static constOrderRequestOffer = '/api/Order/RequestOffer';

  /** Order Send Request for DrinkingWaterSampling */
  static constOrderRequestDrinkingWaterSampling =
    '/api/Order/RequestDrinkingWaterSampling';

  /** Order Send Request for EnergyPerformanceCertificate */
  static constOrderRequestEnergyPerformanceCertificate =
    '/api/Order/RequestEnergyPerformanceCertificate';

  /** Order Send Request for InterimReading */
  static constOrderRequestInterimReading = '/api/Order/RequestInterimReading';

  /** Order Send Request for PostInterimReading */
  static constOrderPostInterimReading = '/api/Order/PostInterimReading';

  /** Order Send Request for orders list */
  static constOrderGet = '/api/Order/Get';

  /** Order Send Request for open orders count */
  static constOrderGetOpenOrderCount = '/api/Order/GetOpenOrderCount';

  /** Order Send Request for cancellation */
  static constOrderCancel = '/api/Order/Cancel';

  static constOrderGetLastReading = '/api/Order/GetLastReading';

  /** Order Get Edit Plumbing */
  static constOrderGetEditPlumbing = '/api/Order/GetEditPlumbing';

  /** Order Get Edit Reading */
  static constOrderGetEditReading = '/api/Order/GetEditReading';

  /** Order Get Edit Smoke Detector test */
  static constOrderGetEditSmokeDetectorTest =
    '/api/Order/GetEditSmokeDetectorTest';

  /** Order Get Edit Interim Reading */
  static constOrderGetEditInterimReading = '/api/Order/GetEditInterimReading';

  /** Order Get Edit InterimReading Self */
  static constOrderGetEditInterimReadingSelf = '/api/Order/GetEditInterimReadingSelf';

  /** Order Get Edit Energy Performance */
  static constOrderGetEditEnergyPerformance = '/api/Order/GetEditEnergyPerformance';

  /** Order Get Energy Performance prefill data */
  static constOrderGetEnergyCertificatePreFillData = '/api/Order/GetEnergyCertificatePreFillData';

  /** Order Get interim reading prefill data */
  static constOrderGetInterimReadingUserMovingOut = '/api/Order/GetInterimReadingUserMovingOut';

  /** Order Get Edit Offer Request */
  static constOrderGetEditOfferRequest = '/api/Order/GetEditOfferRequest';

  /** Detail */
  static constDetail = '/api/Account/Detail';

  /** Update General etting */
  static constUpdateGeneralSetting = '/api/Account/UpdateGeneralSetting';

  /** Change Password */
  static constChangePassword = '/api/Account/ChangePassword';

  /** Add Team Member */
  static constAddTeamMember = '/api/Account/AddTeamMember';

  /** Edit Team Member */
  static constEditTeamMember = '/api/Account/EditTeamMember';

  /** Update Member Properties */
  static constUpdateMemberProperties = '/api/Account/UpdateMemberProperties';

  /** Get General Settings */
  static constGetGeneralSetting = '/api/Account/GetGeneralSetting';

  /** Forgot Password */
  static constForgotPassword = '/api/Account/ForgotPassword';

  /** Update Contact Infomation */
  static constUpdateContactInformation =
    '/api/Account/UpdateContactInformation';

  /** Order Send Request for cancellation */
  static constInfoGetContactPersons = '/api/Info/GetContactPersons';

  /** Order Send Request for cancellation */
  static constInfoGetPayrollYear = '/api/Info/GetPayRollYear';

  /** Get Contracts */
  static constContractGet = '/api/Contract/Get';

  /** Get contract document */
  static constContractGetDocument = '/api/Contract/GetContractDocument';

  /** Get Dashboard Infomation */
  static constDashboardGet = '/api/Dashboard/Get';

  /** Get default data Infomation */
  static constDefaultDataGet = '/api/DefaultData/Get';

  /** Get language Infomation */
  static constDefaultGetLanguage = '/api/DefaultData/GetLanguage';

  /** Update language Infomation */
  static constUpdateLanguage = '/api/Language/Update';

  /** Get language Infomation */
  static constLanguageGet = '/api/Language/Get';

  /** Get language Infomation */
  static constSystemSettingsGet = '/api/Setting/Get';

  /** Get Document JSON */
  static constSystemSettingGetDocumentJson = '/api/Setting/GetDocumentJson';

  /** Update language Infomation */
  static constUpdateSettings = '/api/Setting/Update';

  /** Get language Infomation */
  static constUserSettingGet = '/api/UserSetting/Get';

  /** Update language Infomation */
  static constCreateOrUpdateUserSetting = '/api/UserSetting/CreateOrUpdate';

  /** Order Send Request for Accounting PostInterimReading */
  static constAccountingPostInterimReading = '/api/Order/AccountingPostInterimReading';

  /** Get Offer document */
  static constGetOfferDocument = '/api/Order/GetOfferDocument';

  /** Get offers list */
  static constGetOffers = '/api/Order/GetOffers';

  /** Get offers list */
  static constAccountingDeleteOnwer = '/api/Accounting/DeleteOnwer';

  /** Get offers list */
  static constAccountingDeleteRent = '/api/Accounting/DeleteRent';

  /** Get offers list */
  static constAccountingDeleteConcept = '/api/Accounting/DeleteConcept';
}
