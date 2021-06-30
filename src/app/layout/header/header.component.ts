import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { AccountService } from 'src/app/modules/account/account.service';
import { BackButtonService } from '../../shared/services/back-button.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private backButtonService: BackButtonService, private authenticateService: AuthenticationService, private accountService: AccountService) { }

  ngOnInit(): void {
  }

  clickMe() {
    this.backButtonService.sendClickEvent();
  }

  logOut(): void {
    this.authenticateService.logout();
    this.accountService.profileDetail = null;
  }

}
