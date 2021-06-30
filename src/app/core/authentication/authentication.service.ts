import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Url } from '../../shared/Constant/URL';
import { Response } from '../../shared/models/Response';
import { BrowserStorageService } from '../../shared/services/browser-storage/browser-storage.service';
import { User } from '../../shared/models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public isTokenRefreashCall: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private browserStorage: BrowserStorageService,
    private translate: TranslateService,
    private defaultDataService: DefaultDataService) {
    this.isTokenRefreashCall = false;
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(browserStorage.getlocalStorage('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: any): void {
    if (user && user.token) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      this.browserStorage.setlocalStorage('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);

    }
  }

  getNewRefreshToken(): Observable<Response> {
    const currentUser = localStorage.getItem('currentUser');
    return this.http.post<Response>(Url.constAccountGetNewRefreshToken, JSON.parse(JSON.parse(currentUser)));
  }
  // Perform authentication user credentials
  // If authenticated the store user data in local storage. update user in session
  login(username: string, password: string): any {
    return this.http.post<Response>(Url.constAccountLogin, { username, password })
      .pipe(tap(resp => {
        const user = resp.data;
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.browserStorage.setlocalStorage('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }
  logout(): void {
    // remove user from local storage to log user out
    this.logoutFromLogin();
    this.router.navigate(['/']);
  }

  logoutFromLogin(): void {
    // remove user from local storage to log user out
    this.browserStorage.removelocalStorage('currentUserLang');
    this.browserStorage.removelocalStorage('currentUserGridSize');
    this.defaultDataService.DefaultData.systemSettings.gridPageSize = this.defaultDataService.systemGridSize;
    // this.translate.setDefaultLang('en');
    // this.translate.use('en');
    this.browserStorage.removelocalStorage('currentUser');
    this.browserStorage.removeSessionStorage('search');
    this.browserStorage.removeSessionStorage('userProperties');
    this.currentUserSubject.next(null);
  }
}
