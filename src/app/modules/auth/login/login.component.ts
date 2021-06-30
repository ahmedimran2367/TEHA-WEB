import { Component, OnInit } from '@angular/core';
import { UserCredential } from '../models/UserCredential';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordRequest } from '../models/ForgotPasswordRequest';
import { HttpClient } from '@angular/common/http';
import { Url } from '../../../shared/Constant/URL';
import { ResponseStatus } from 'src/app/shared/models/Response';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { SystemSettingsService } from '../../admin/services/system-settings.service';
import { UserSetting } from '../../admin/models/user-setting-model';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userSetting: UserSetting;
  userCredential: UserCredential;
  returnUrl: string;
  invalidInd = false;
  showForgotScreen = true;
  forgotPasswordRequest: ForgotPasswordRequest;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private router: Router,
    private httpClient: HttpClient,
    private toastService: ToastService,
    private defaultDataService: DefaultDataService,
    private systemSettingService: SystemSettingsService,
    private browserService: BrowserStorageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.showForgotScreen = true;
    this.userCredential = new UserCredential();
    this.forgotPasswordRequest = new ForgotPasswordRequest();
    this.authenticationService.currentUser.subscribe((user) => {
      if (user) {
        if (!this.authenticationService.isTokenRefreashCall) {
          this.router.navigateByUrl('/home');
        }
      }
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  Authenticate(): void {
    if (
      this.userCredential.Username !== '' &&
      this.userCredential.Password !== ''
    ) {
      this.authenticationService
        .login(this.userCredential.Username, this.userCredential.Password)
        .pipe(first())
        .subscribe(
          (data) => {
            this.invalidInd = false;
            this.router.navigate(['home']);
            this.systemSettingService
              .GetUserSetting(data.data.id)
              .subscribe((res) => {
                if (res['Status'] == 0 && res['Data'] != null) {
                  this.userSetting = new UserSetting();
                  this.userSetting = res['Data'];
                  if (this.userSetting.GridSize) {
                    this.defaultDataService.DefaultData.systemSettings.gridPageSize = this.userSetting.GridSize;
                    this.browserService.setlocalStorage(
                      'currentUserGridSize',
                      this.userSetting.GridSize
                    );
                  }
                  if (this.userSetting.Language) {
                    this.browserService.setlocalStorage(
                      'currentUserLang',
                      this.userSetting.Language
                    );
                    this.translate.use(this.userSetting.Language);
                  }
                }
              });
            // this.InProgress = false;
            // if (this.snackBarRef != undefined) {
            //   this.snackBarRef.dismiss();
            // }
            // This checks if there is a redirect Url . If there is a Redirect Url . It will redirect to that Url.
            if (
              this.returnUrl.trim().length != 0 &&
              this.returnUrl.trim() != '/'
            ) {
              this.router.navigateByUrl(
                decodeURI(this.route.snapshot.queryParams['returnUrl'])
              );
            }
            // otherwise it will go to the dashboard Url
            else {
              // Navigate to Dashboard
              this.router.navigate(['home']);
            }
          },
          (error) => {
            if (error.status == 400) {
              this.invalidInd = true;
            }
          }
        );
    }
  }
  redirectToForgotPassword(): void {
    this.showForgotScreen = false;
  }
  goBack(): void {
    this.forgotPasswordRequest.username = '';
    this.showForgotScreen = true;
  }
  submit(): void {
    this.httpClient
      .post<Response>(Url.constForgotPassword, this.forgotPasswordRequest)
      .subscribe(
        (res) => {
          if (res.status == ResponseStatus.OK) {
            this.forgotPasswordRequest.username = '';
            this.showForgotScreen = true;
          } else {
            this.toastService.openSnackError('Please try later!');
          }
        },

        (err) => this.toastService.openSnackError(err.message)
      );
  }
}
