import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Url } from 'src/app/shared/Constant/URL';
import { User } from 'src/app/shared/models/user.model';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { GetDocumentsRequest } from './models/get-documents-request.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentArchivesService {
  user: User;
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

  getInvoices(allBuildingsInd: boolean, payrollYear: any): Observable<any> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString());
    if (!allBuildingsInd){
      params = params.set(
        'propertyId',
        this.browserService.getlocalStorage('currentPropertyId').toString()
      );
    }
    if (payrollYear && payrollYear !== 'all') {
      params = params.append('payrollYear', payrollYear.toString());
    }
    return this.httpClient.get<any>(Url.constDocumentArchivesGetInvoices, {
      params,
    });
  }

  getDocuments(
    payrollYear: any,
    type: string,
    propertyLevelInd: boolean,
    flatLevelInd: boolean,
    meterLevelInd: boolean
  ): Observable<any> {
    const getDocumentsRequest = new GetDocumentsRequest();

    getDocumentsRequest.userId = this.user.id;
    getDocumentsRequest.propertyId = this.browserService.getlocalStorage(
      'currentPropertyId'
    );
    getDocumentsRequest.type = type;

    if (payrollYear && payrollYear !== 'all') {
      getDocumentsRequest.payrollYear = payrollYear;
    }

    getDocumentsRequest.propertyLevelInd = propertyLevelInd;
    getDocumentsRequest.flatLevelInd = flatLevelInd;
    getDocumentsRequest.meterLevelInd = meterLevelInd;

    return this.httpClient.post<any>(
      Url.constDocumentArchivesAll,
      getDocumentsRequest
    );
  }

  getAllSepaDocuments(): Observable<any> {
    const params = new HttpParams().set('userId', this.user.id.toString());
    return this.httpClient
      .get<any>(Url.constDocumentArchivesAllSEPA, { params })
      .pipe(
        map((t) =>
          t.data.filter(
            (p) =>
              p.id === this.browserService.getlocalStorage('currentPropertyId')
          )
        )
      );
  }

  downloadDocumentContent(
    documentId: number,
    type: string,
    levelIndicator?: string,
    payrollYearId?: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set(
        'propertyId',
        this.browserService.getlocalStorage('currentPropertyId').toString()
      )
      .set('type', type);
    if (documentId) {
      params = params.append('id', documentId.toString());
    } else {
      params = params.append('levelIndicator', levelIndicator);
    }
    if (payrollYearId) {
      params = params.append('payrollYearId', payrollYearId?.toString());
    }
    return this.httpClient.get<any>(Url.constDocumentArchivesGetContent, {
      params,
    });
  }

  downloadSepaContent(newInd: boolean): Observable<any> {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set(
        'propertyId',
        this.browserService.getlocalStorage('currentPropertyId').toString()
      )
      .set('newInd', (newInd as any) as string);
    return this.httpClient.get<any>(Url.constDocumentArchivesGetSEPA, {
      params,
    });
  }

  getPayrollYear(): Observable<any> {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set(
        'propertyId',
        this.browserService.getlocalStorage('currentPropertyId').toString()
      );
    return this.httpClient.get<any>(Url.constInfoGetPayrollYear, { params });
  }
}
