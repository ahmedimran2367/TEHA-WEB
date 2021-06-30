import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { User } from 'src/app/shared/models/user.model';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';

@Component({
  selector: 'app-data-exchange',
  templateUrl: './data-exchange.component.html',
  styleUrls: ['./data-exchange.component.scss'],
})
export class DataExchangeComponent implements OnInit {
  url = '';
  urll: SafeResourceUrl;
  user: User;

  constructor(
    private sanitizer: DomSanitizer,
    private authenticationService: AuthenticationService,
    public defaultDataService: DefaultDataService
  ) {
    this.authenticationService.currentUser.subscribe((u) => {
      if (u != null) {
        this.user = u;
      }
    });
    this.url = this.defaultDataService.DefaultData.systemSettings.dataExchangeUrl;
    // this.url = `http://onlineservices.teha-wd.de:652/ishaca/loginDataExchange.do?userId=${this.user.id}&propertyId=${this.browserService.getlocalStorage('currentPropertyId')}`;
    this.urll = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  ngOnInit(): void {}
}
