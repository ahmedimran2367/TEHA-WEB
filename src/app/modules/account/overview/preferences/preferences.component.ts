import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { UserSetting } from 'src/app/modules/admin/models/user-setting-model';
import { User } from 'src/app/shared/models/user.model';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { SystemSettingsService } from '../../../admin/services/system-settings.service';
@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  language: string;
  gridSize: any;
  public userSetting: UserSetting = new UserSetting();
  user: User;
  reload = false;
  @Output() onGridSizeChanged = new EventEmitter();
  @Output() languageChangeEvent = new EventEmitter<any>();
  constructor(
    private translateService: TranslateService,
    private systemSettingsService: SystemSettingsService,
    private authenticationService: AuthenticationService,
    private defaultDataService: DefaultDataService,
    private browserService: BrowserStorageService,
    private router: Router,
    private toastService: ToastService) {
    this.authenticationService.currentUser.subscribe((u) => {
      if (u != null) {
        this.user = u;
      }
    });
    if (this.browserService.getlocalStorage('currentUserLang')) {
      this.language = this.browserService.getlocalStorage('currentUserLang');
    }
    else {
      this.language = this.translateService.currentLang;
    }
    if (this.browserService.getlocalStorage('currentUserGridSize')) {
      this.gridSize = this.browserService.getlocalStorage('currentUserGridSize').toString();
    }
    else {
      this.gridSize = this.defaultDataService.DefaultData.systemSettings.gridPageSize.toString();
    }
  }

  ngOnInit(): void {
  }
  changeLanguage(value): void {
    this.reload = false;
    this.userSetting.Language = value;
    this.userSetting.GridSize = parseInt(this.gridSize);
    if (value === 'en') {
      this.translateService.use('en');
      this.browserService.setlocalStorage('currentUserLang', 'en');
    }
    else {
      this.translateService.use('de');
      this.browserService.setlocalStorage('currentUserLang', 'de');
    }
    this.languageChangeEvent.emit();
  }
  changeGridSize(value): void {
    this.reload = true;
    this.userSetting.GridSize = parseInt(value);
    this.defaultDataService.DefaultData.systemSettings.gridPageSize = parseInt(value);
    this.browserService.setlocalStorage('currentUserGridSize', parseInt(value));
    // this.save();
  }
  save(): void {
    this.userSetting.UserId = this.user.id;
    this.userSetting.Id = 0;
    if (!this.userSetting.Language) {
      this.userSetting.Language = this.translateService.currentLang;
    }
    this.systemSettingsService.CreateOrUpdateUserSetting(this.userSetting).subscribe(res => {
      if (res['Status'] == 0) {
        this.translateService.get('miscellaneous.changedSuccessfully').subscribe(value => { this.toastService.openSnackSuccessfully(value); });
        if (this.reload) {
          this.onGridSizeChanged.emit();
        }
      }
    });
  }
}
