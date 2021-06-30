import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Url } from 'src/app/shared/Constant/URL';
import { OrderRequest } from '../models/orderRequest';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { User } from 'src/app/shared/models/user.model';
import { Response } from 'src/app/shared/models/Response';
import { OrderEnergyPerformanceRequest } from '../models/order-energy-performance-request.model';
import { ReadingRequest } from '../models/readingRequest';
import { OrderPlumbingRequest } from '../models/order-plumbing-request.model';
import { SmokeDetectorRequest } from '../models/smokeDetectorRequest';
import { InterimReadingSelf } from '../models/interimReadingSelf';
import { OfferRequest } from '../models/offerRequest';
import { OrderReadingRequest } from '../models/orderReadingRequest';
import { WaterSamplingRequest } from '../models/waterSamplingRequest';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  orderRequest: OrderRequest = new OrderRequest();
  user: User;
  offerRequestObj: OfferRequest = null;
  waterSamplingRequest: WaterSamplingRequest = null;
  constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService, private browserService: BrowserStorageService) {
    // get user
    this.authenticationService.currentUser.subscribe((u) => {
      if (u != null) {
        this.user = u;
        this.orderRequest.userId = this.user.id;
      }
    });

    // Set default Order Request parameter
  }

  // Gets list of orders
  getOrders(freeText: string, type: string[], status: string[], pageNo: number, pageSize: number, sortBy: string, sortDirection: string): Observable<Response> {
    this.orderRequest.userId = this.user.id;
    this.orderRequest.freeText = freeText;
    this.orderRequest.type = type;
    this.orderRequest.status = status;
    this.orderRequest.pageNo = pageNo;
    this.orderRequest.pageSize = Number(pageSize);
    this.orderRequest.sort.by = sortBy;
    this.orderRequest.sort.direction = sortDirection;

    return this.httpClient.post<any>(Url.constOrderGet, this.orderRequest);
  }

  cancelOrder(id): Observable<Response> {
    const orderCancelRequest = {
      id,
      userId: this.user.id
    };
    return this.httpClient.put<any>(Url.constOrderCancel, orderCancelRequest);
  }

  orderEnergyPerformanceCertificate(orderRequest: OrderEnergyPerformanceRequest): Observable<any> {
    orderRequest.userId = this.user.id;
    return this.httpClient.post<any>(Url.constOrderRequestEnergyPerformanceCertificate, orderRequest);
  }
  GetEnergyCertificatePreFillData(propertyId: number): Observable<Response> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', propertyId.toString());

    return this.httpClient.get<any>(Url.constOrderGetEnergyCertificatePreFillData, { params });
  }
  orderPlumbing(orderRequest: OrderPlumbingRequest): Observable<Response> {
    orderRequest.userId = this.user.id;
    return this.httpClient.post<any>(Url.constOrderRequestPlumbing, orderRequest);
  }
  // interim reading request
  RequestInterimReading(readingRequest: ReadingRequest): Observable<Response> {
    readingRequest.userId = this.user.id;
    return this.httpClient.post<any>(Url.constOrderRequestInterimReading, readingRequest);
  }
  GetInterimReadingUserMovingOut(propertyId: number, flatId: number): Observable<Response> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', propertyId.toString())
      .set('flatId', flatId?.toString());

    return this.httpClient.get<any>(Url.constOrderGetInterimReadingUserMovingOut, { params });
  }

  // Post RequestSmokeDetectorTest
  RequestSmokeDetectorTest(smokeDetectorRequest: SmokeDetectorRequest): Observable<Response> {
    smokeDetectorRequest.userId = this.user.id;
    return this.httpClient.post<any>(Url.constOrderRequestSmokeDetectorTest, smokeDetectorRequest);
  }

  // Enter interim reading request
  postInterimReading(obj: InterimReadingSelf, vaccantInd: boolean): Observable<Response> {
    let request: InterimReadingSelf = JSON.parse(JSON.stringify(obj));
    if (vaccantInd) {
      request.userMovingIn = null;
    }
    request.userId = this.user.id;
    return this.httpClient.post<any>(Url.constOrderPostInterimReading, request);
  }
  

    // Enter accounting interim reading request
    AccountingPostInterimReading(obj: InterimReadingSelf, vaccantInd: boolean): Observable<Response> {
      let request: InterimReadingSelf = JSON.parse(JSON.stringify(obj));
      request.userId = this.user.id;
      return this.httpClient.post<any>(Url.constAccountingPostInterimReading, request);
    }

  // Post ReadingRequest
  RequestReading(orderReadingRequest: OrderReadingRequest): Observable<Response> {
    orderReadingRequest.userId = this.user.id;
    return this.httpClient.post<any>(Url.constOrderRequestReading, orderReadingRequest);
  }
  // Save request Offer
  requestOffer(): any {
    this.offerRequestObj.userId = this.user.id;
    return this.httpClient.post<any>(Url.constOrderRequestOffer, this.offerRequestObj);
  }
  // Save request Offer
  RequestDrinkingWaterSampling(): any {
    this.waterSamplingRequest.userId = this.user.id;
    this.waterSamplingRequest.propertyId = this.browserService.getlocalStorage('currentPropertyId');
    return this.httpClient.post<any>(Url.constOrderRequestDrinkingWaterSampling, this.waterSamplingRequest);
  }
  // Get Last Reading of meters
  getLastReading(propertyId: number, flatId: number, meterId: number = null, moveOutDate: string = null): Observable<Response> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', propertyId.toString())
      .set('flatId', flatId.toString());
    if (meterId) {
      params = params.append('meterId', meterId.toString());
    }
    if (moveOutDate) {
      params = params.append('moveOutDate', moveOutDate.toString());      
    }

    return this.httpClient.get<any>(Url.constOrderGetLastReading, { params });
  }

  getEditPlumbing(orderId: number, propertyId: number): Observable<any> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', propertyId.toString())
      .set('orderId', orderId.toString());

    return this.httpClient.get<any>(Url.constOrderGetEditPlumbing, { params });
  }

  getEditReading(orderId: number, propertyId: number): Observable<any> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', propertyId.toString())
      .set('orderId', orderId.toString());

    return this.httpClient.get<any>(Url.constOrderGetEditReading, { params });
  }

  getEditSmokeDetectorTest(orderId: number, propertyId: number): Observable<any> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', propertyId.toString())
      .set('orderId', orderId.toString());

    return this.httpClient.get<any>(Url.constOrderGetEditSmokeDetectorTest, { params });
  }

  getEditInterimReading(orderId: number, propertyId: number): Observable<any> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', propertyId.toString())
      .set('orderId', orderId.toString());

    return this.httpClient.get<any>(Url.constOrderGetEditInterimReading, { params });
  }

  getEditInterimReadingSelf(orderId: number, propertyId: number): Observable<any> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', propertyId.toString())
      .set('orderId', orderId.toString());

    return this.httpClient.get<any>(Url.constOrderGetEditInterimReadingSelf, { params });
  }

  getEditEnergyPerformance(orderId: number, propertyId: number): Observable<any> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', propertyId.toString())
      .set('orderId', orderId.toString());

    return this.httpClient.get<any>(Url.constOrderGetEditEnergyPerformance, { params });
  }

  getEditOfferRequest(orderId: number): Observable<any> {
    let params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('orderId', orderId.toString());

    return this.httpClient.get<any>(Url.constOrderGetEditOfferRequest, { params });
  }
  getOfferDocument(id: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('id', id.toString());
    return this.httpClient.get<any>(Url.constGetOfferDocument, {
      params,
    });
  }
  getOffers(): Observable<any> {
    const params = new HttpParams().set('userId', this.user.id.toString());
    return this.httpClient.get<any>(Url.constGetOffers, {
      params,
    });
  }

}
