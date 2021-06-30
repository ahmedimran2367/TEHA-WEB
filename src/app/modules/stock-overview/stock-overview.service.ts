import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Url } from 'src/app/shared/Constant/URL';
import { User } from 'src/app/shared/models/user.model';
import { PropertyRequest } from './models/property-request.model';
import { FlatRequest } from './models/flat-request.model';

@Injectable({
  providedIn: 'root',
})
export class StockOverviewService {
  user: User;
  public propertyId: number;
  public flatId: number;
  public propertyData: any;
  public flatData: any;
  public meterData: any;
  public flatsCount: number;
  public metersCount: number;
  public inProgressCountData: any;
  public allMetersIndicator: boolean;
  public flatRequest: FlatRequest = {
    userId: null,
    propertyIds: [],
    flatIds: [],
    includeChildren: false,
  };

  propertyRequest: PropertyRequest = {
    userId: null,
    propertyIds: [],
    freeText: '',
    rwmStatus: null,
    accountingStatus: null,
    readingStatus: null,
    plumbingStatus: null,
    accountingMonth: null,
    dta: null,
    pageNo: 0,
    pageSize: 10,
    sort: {
      by: 'tehaLgNo',
      direction: 'asc',
    },
    includeChildren: true,
    payrollClosingYear: null
  };
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe((u) => {
      if (u != null) {
        this.user = u;
        this.propertyRequest.userId = this.user.id;
        this.flatRequest.userId = this.user.id;
      }
    });
  }
  getProperties(
    propertyRequest: PropertyRequest
  ): Observable<any> {
    propertyRequest.userId = this.user.id;
    return this.httpClient.post<any>(
      Url.constStockOverviewProperties,
      propertyRequest
    );
  }

  getFlats(
    propertyId: number,
    flatId: number,
    childInd: boolean
  ): Observable<any> {
    this.flatRequest.propertyIds = [];
    this.flatRequest.propertyIds.push(propertyId);
    if (flatId) {
      this.flatRequest.flatIds.push(flatId);
    } else {
      this.flatRequest.flatIds = [];
    }
    this.flatRequest.includeChildren = childInd;
    return this.httpClient.post<any>(
      Url.constStockOverviewGetFlats,
      this.flatRequest
    );
  }

  getAllMeters(propertyId: number): Observable<any> {
    const params = new HttpParams()
    .set('userId', this.user.id.toString())
    .set('propertyId', propertyId.toString());
    return this.httpClient.get<any>(Url.constStockOverviewGetAllMeters, { params });
  }

  downloadOpenLetter(propertyId: number, flatId
    = null): Observable<any> {
    let params = new HttpParams()
    .set('userId', this.user.id.toString())
    .set('propertyId', propertyId.toString());
    if (flatId){
      params = params.append('flatId', flatId.toString());
    }
    return this.httpClient.get<any>(Url.constStockOverviewGetOpenLetter, { params });
  }

  getPropertiesWithoutChild(): Observable<any> {
    this.propertyRequest.pageSize = 1000;
    this.propertyRequest.includeChildren = false;
    return this.httpClient.post<any>(
      Url.constStockOverviewProperties,
      this.propertyRequest
    );
  }
  getSummary(): Observable<any> {
    const params = new HttpParams().set('userId', this.user.id.toString());
    return this.httpClient.get<any>(Url.constStockOverviewSummary, { params });
  }
  getFlatsByProperyty(flatRequest: FlatRequest): Observable<any>{
    return this.httpClient.post<any>(Url.constStockOverviewGetFlats, flatRequest);
  }
}
