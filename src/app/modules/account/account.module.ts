import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './overview/account.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from './overview/general/general.component';
import { NotificationComponent } from './overview/notification/notification.component';
import { PasswordComponent } from './overview/password/password.component';
import { MyContractsTableComponent } from './overview/my-contracts/my-contracts.component';

import { MyTeamsTableComponent } from './overview/my-teams-table/my-teams-table.component';
import { PreferencesComponent } from './overview/preferences/preferences.component';
import { MatSortModule } from '@angular/material/sort';
import { MyOffersComponent } from './overview/my-offers/my-offers.component';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    MatSortModule,
    MatTooltipModule,
  ],
  declarations: [
    AccountComponent,
    GeneralComponent,
    NotificationComponent,
    PasswordComponent,
    MyContractsTableComponent,
    MyTeamsTableComponent,
    PreferencesComponent,
    MyOffersComponent,
  ]
})
export class AccountModule {}
