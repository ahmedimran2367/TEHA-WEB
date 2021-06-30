import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { AccountService } from 'src/app/modules/account/account.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  constructor(private authenticateService: AuthenticationService, private accountService: AccountService) {}

  @Input() sidebarOpen: boolean;

  ngOnInit(): void {}

  getLogo(): string {
    if (this.sidebarOpen === true) {
      return './assets/images/teha_logo.png';
    } else {
      return './assets/images/teha-symbol.png';
    }
  }
  logOut(): void {
    this.authenticateService.logout();
    this.accountService.profileDetail = null;
  }
}
