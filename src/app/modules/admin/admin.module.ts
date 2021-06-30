import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LanguageSettingComponent } from './language-setting/language-setting.component';
import { HttpClientModule } from '@angular/common/http';
import { LanguageTableComponent } from './language-table/language-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SystemSettingsTableComponent } from './settings/system-settings-table/system-settings-table.component';
import { SystemSettingsComponent } from './settings/system-settings/system-settings.component';

@NgModule({
  declarations: [
    LanguageSettingComponent,
    LanguageTableComponent,
    SystemSettingsTableComponent,
    SystemSettingsComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, HttpClientModule, SharedModule],
  providers: [],
})
export class AdminModule {}
