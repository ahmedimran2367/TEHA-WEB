import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Url } from 'src/app/shared/Constant/URL';
import { Response } from 'src/app/shared/models/Response';
import { User } from 'src/app/shared/models/user.model';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { Property } from '../../shared/models/property.model';
import { CostData } from './model/costData';
import { FlatData } from './model/flatData';
import { PayrollYear } from './model/PayrollYear';
import { AccountingRequest } from './model/Accounting';
import { SummaryAndRelease } from './model/summaryAndRelease';

@Injectable({
  providedIn: 'root',
})
export class AccountingService {
  property: Property;
  userDataFirstAttemptInd: boolean;
  costDataFirstAttemptInd: boolean;
  lastPayrollYearId = 0;
  user: User;
  flatData: FlatData = null;
  originalFlatData: FlatData = null;
  actualCostData: CostData = null;
  currentBillingPeroid: PayrollYear;
  dataExchangeOnly = false;
  savedEnterInterimInd = false;
  userDataSelectedMoveOutDate = null;
  setOwnerDataClick=false;
  public costDataSubject: BehaviorSubject<CostData> = new BehaviorSubject<CostData>(
    null
  );
  public costData: Observable<CostData>;
  accountingRequest = new AccountingRequest();
  summaryAndRelease: SummaryAndRelease;
  noOfUserChanges = 0;
  summaryStepper=1;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private browserService: BrowserStorageService
  ) {
    this.authenticationService.currentUser.subscribe((u) => {
      if (u != null) {
        this.user = u;
      }
    });
  }
  getAccounting(accountingRequest: AccountingRequest): Observable<any> {
    this.flatData = null;
    this.originalFlatData = null;
    this.noOfUserChanges = 0;
    this.costDataSubject.next(null);
    this.summaryAndRelease=null;
    this.summaryStepper=1;
    accountingRequest.userId = this.user.id;
    return this.httpClient.post<any>(
      Url.AccountingGetAccountingPeriods,
      accountingRequest
    );
  }
  getLastUpdatedDates(): Observable<any> {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', this.property.id.toString())
      .set('payrollYear', this.property.billingPeroidId.toString());
    return this.httpClient.get<any>(Url.constGetLastUpdatedDates, {
      params,
    });
  }

  getFlatUsers(lastPayrollYearId): Observable<any> {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', this.property.id.toString())
      .set('payrollYear', lastPayrollYearId.toString());
    return this.httpClient.get<any>(Url.constAccountingGetFlatUsers, {
      params,
    });
  }
  saveFlatUsers(): Observable<Response> {
    return this.httpClient.post<any>(
      Url.constAccountingSaveFlatUsers,
      this.flatData
    );
  }
  getSummaryAndReleaseInfo(lastPayrollYearId): Observable<Response> {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', this.property.id.toString())
      .set('payrollYear', lastPayrollYearId.toString());
    return this.httpClient.get<any>(
      Url.constAccountingGetSummaryAndReleaseInfo,
      {
        params,
      }
    );
  }

  getNoofUserChanges(): any {
    let counter = 0;
    if (this.flatData?.flatUser) {
      this.flatData.flatUser.forEach((ele) => {
        ele.rentals.forEach((element) => {
          if (element.nameChange?.userChangedInd == true) {
            counter++;
          }
        });
      });
      return counter;
    } else { return counter; }
  }

  // Get Cost Data of property by payroll year.
  getCostData(PayrollYearId): Observable<Response> {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', this.property.id.toString())
      .set('payrollYear', PayrollYearId.toString());
    return this.httpClient.get<any>(Url.constAccountingGetCost, {
      params,
    });
  }

  saveCostData(costData: CostData): any {
    return this.httpClient.post<any>(Url.constAccountingSaveCost, costData);
  }
  saveSummaryAndReleaseInfo(obj: any): any {
    return this.httpClient.post<any>(Url.contSetSummaryAndReleaseInfo, obj);
  }
  submit(comments: string): Observable<Response> {
    let obj = {
      userId: Number(this.user.id),
      propertyId: Number(this.property.id),
      payrollYearId: Number(this.property.billingPeroidId),
      cancellationPolicyInd: true,
      confirmTheCompletenessInd: true,
      subjectToFeeInd: true,
      comments,
    };
    return this.httpClient.post<any>(Url.constAccountingSubmit, obj);
  }
  deleteCost(costId): any {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', this.property.id.toString())
      .set('costId', costId.toString());
    return this.httpClient.delete<any>(Url.constAccountingDeleteCost, {
      params,
    });
  }
  deleteConcept(conceptId): any {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', this.property.id.toString())
      .set('conceptId', conceptId.toString());
    return this.httpClient.delete<any>(Url.constAccountingDeleteConcept, {
      params,
    });
  }
  deleteRental(flatId,rentId): any {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', this.property.id.toString())
      .set('faltId', flatId.toString())
      .set('rentId', rentId.toString());
    return this.httpClient.delete<any>(Url.constAccountingDeleteRent, {
      params,
    });
  }
  deleteOnwer(flatId,onwerId): any {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', this.property.id.toString())
      .set('faltId', flatId.toString())
      .set('onwerId', onwerId.toString());
    return this.httpClient.delete<any>(Url.constAccountingDeleteOnwer, {
      params,
    });
  }
}
