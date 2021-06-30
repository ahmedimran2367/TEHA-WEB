import { Injectable } from '@angular/core';
// import { ErrorDialogService } from '../error-dialog/errordialog.service';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { Response } from '../../shared/models/Response';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import {
  tap,
  catchError,
  switchMap,
  finalize,
  filter,
  take,
} from 'rxjs/operators';
import { BrowserStorageService } from '../../shared/services/browser-storage/browser-storage.service';
import { environment } from 'src/environments/environment';
// import { LogService } from './log-service/log-service.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  private isTokenRefreshing = false;

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  constructor(
    private browserStorage: BrowserStorageService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const baseUrl = environment.baseUrl;
    request = request.clone({ url: baseUrl + request.url });
    request = request.clone({
      headers: request.headers.set('Content-Type', `application/json`),
    });

    return next.handle(this.attachTokenToRequest(request)).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log("Success");
        }
      }),
      catchError(
        (err): Observable<any> => {
          if (err instanceof HttpErrorResponse) {
            switch ((err as HttpErrorResponse).status) {
              case 401:
                return this.authenticationService.logout() as any;
                // console.log(err);
                // if (err.error.message === 'Refresh Token Expired.') {
                //   return this.authenticationService.logout() as any;
                // }
                // const resp = this.handleHttpResponseError(request, next);
                // return resp;
              case 400: {
                // to do
                // show error
                return throwError(err);
              }
              case 404: {
                return throwError(err);
              }
              case 409: {
                return throwError(err);
              }
              case 500: {
                return throwError(err);
              }
              default: {
                break;
              }
            }
          } else {
            return throwError(err);
          }
        }
      )
    );
  }

  // Method to handle http error response
  private handleHttpResponseError(
    request: HttpRequest<any>,
    next: HttpHandler
  ): any {
    // First thing to check if the token is in process of refreshing
    if (!this.isTokenRefreshing) {
      // If the Token Refresheing is not true
      this.isTokenRefreshing = true;
      // Any existing value is set to null
      // Reset here so that the following requests wait until the token comes back from the refresh token API call
      this.tokenSubject.next(null);
      this.authenticationService.isTokenRefreashCall = true;
      /// call the API to refresh the token
      return this.authenticationService.getNewRefreshToken().pipe(
        switchMap((tokenresponse: Response) => {
          if (tokenresponse) {
            this.tokenSubject.next(tokenresponse.data.token);
            this.authenticationService.setCurrentUser(tokenresponse.data);
            setTimeout(() => {
              this.authenticationService.isTokenRefreashCall = false;
            }, 1000);
            return next.handle(this.attachTokenToRequest(request));
          }
          this.authenticationService.logout();
          return '' as any;
        }),
        catchError((err) => {
          this.authenticationService.logout();
          return throwError(err);
        }),
        finalize(() => {
          this.isTokenRefreshing = false;
        })
      );
    } else {
      this.isTokenRefreshing = false;
      return this.tokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.attachTokenToRequest(request));
        })
      );
    }
  }
  private attachTokenToRequest(request: HttpRequest<any>): any {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
    }
    return request;
  }
}
