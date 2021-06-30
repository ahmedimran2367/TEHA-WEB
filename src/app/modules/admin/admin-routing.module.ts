import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LanguageSettingComponent } from './language-setting/language-setting.component';
import { SystemSettingsComponent } from './settings/system-settings/system-settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'language',
    pathMatch: 'full'
  },
  {
    path: 'language',
    component: LanguageSettingComponent
  },
  {
    path: 'settings',
    component: SystemSettingsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
