import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Url } from 'src/app/shared/Constant/URL';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  user: User;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe((u) => {
      if (u != null) {
        this.user = u;
      }
    });
  }

  getDashboardData(): Observable<any> {
    const params = new HttpParams().set('userId', this.user.id.toString());

    return this.httpClient.get<any>(Url.constDashboardGet, {
      params,
    });
  }
}
