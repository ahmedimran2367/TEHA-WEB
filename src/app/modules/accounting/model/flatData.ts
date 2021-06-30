export class FlatData {
  userId: number;
  propertyId: number;
  payrollYearId: number;
  flatUser: FlatUser[] = [];
  updatedDate: string;
  confirmTheCompletenessInd: boolean | null;
}

export class FlatUser {
  flatId: number | null;
  tehaUserNo: string;
  adminUserNo: string;
  rentals: RentalInformation[] = [];
  owners: OwnerInformation[] = [];
}

export class RentalInformation {
  constructor(flatId: number, adminUserNo, tehaUserNo, hotWaterArea, heatingArea) {
    this.nameChange = new NameChange();
    this.contact = new ContactInformation();
    this.flatId = flatId;
    this.adminUserNo = adminUserNo;
    this.tehaUserNo = tehaUserNo;
    this.hotWaterArea = hotWaterArea;
    this.heatingArea = heatingArea;
  }
  rentId: number | null = -1;
  flatId: number | null;
  moveInDate: string;
  moveOutDate: string;
  adminUserNo: string;
  tehaUserNo: string;
  numberOfpeople: number | null = null;
  advancePayment: number | null = null;
  additionalArea: number | null = null;
  hotWaterArea: number | null = null;
  heatingArea: number | null = null;
  nameChange: NameChange;
  contact: ContactInformation;
  rentNumber: string;
  flatDesc: string;
  adminDesc: string;
  allMoveOutReadingsInd: boolean | null = null;
  flatEmptyInd: boolean | null = false;
  // <summary>
  /// Gets or sets delete indicator
  /// </summary>
  deleteInd: boolean;
}

export class OwnerInformation {
  constructor(propertyId, flatId, payrollYearId) {
    this.contact = new ContactInformation();
    this.propertyId = propertyId;
    this.flatId = flatId;
    this.payrollYearId = payrollYearId;
  }
  ownerId: number | null = -1;
  propertyId: number | null;
  flatId: number | null;
  payrollYearId: number | null;
  startDate: string = null;
  endDate: string;
  adminNumber: string;
  contact: ContactInformation;
  // <summary>
  /// Gets or sets delete indicator
  /// </summary>
  deleteInd: boolean;
}

export class ContactInformation {
  salutationCode: string;
  firstName: string = null
  lastName: string = null
  street: string;
  postcode: string;
  place: string;
  email: string;
  additionalEmails: string[];
  phone: string;
  mobile: string;
  fax: string;
  customerNumber: string;
  latitude: number | null;
  longitude: number | null;
  scheduleAvailable: string;
}

export class NameChange {
  name: string = null;
  newName: string = null;
  userChangedInd = true;
}
