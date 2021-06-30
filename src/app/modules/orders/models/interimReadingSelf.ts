import { UserMovingDetail } from './userMovingDetail';

export class InterimReadingSelf {
    constructor() {
        this.meterReadings = [];
        this.userMovingIn = new UserMovingDetail();
        this.userMovingOut = new UserMovingDetail();
    }

    userId: number | null;
    propertyId: number | null;
    flatId: number | null;
    userMovingOut: UserMovingDetail;
    userMovingIn: UserMovingDetail;
    meterReadings: MeterReading[];
    termsInd: boolean | null = false;
    costsInd: boolean | null = false;
    dataProtectionInd: boolean | null = false;
}

export class MeterReading {
    meterId: number | null;
    value: string;
    image: FileContentResponse[];
    lastReading: string;
    meterTypeDesc: string;
    serialNumber: any;
    location: any;
    tehaUserNo: any;
    adminUserNo: any;
    address: any;
    userMovingOut: any;
    movingOutDate: any;
    warning: boolean;
    meterWithResetInd: boolean;
    error: boolean;
}
/// <summary>
/// FileContentResponse Model
/// </summary>
export class FileContentResponse {
    /// <summary>
    /// Gets or Sets Filename
    /// </summary>
    filename: string;
    /// <summary>
    /// Gets or Sets Content of the file
    /// </summary>
    content: string;
  }
  ///
