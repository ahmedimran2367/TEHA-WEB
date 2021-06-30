import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnsavedDataGuard } from 'src/app/core/guard/unsaved-data-guard.guard';

import { AccountComponent } from './overview/account.component';

const routes: Routes = [{ path: '', component: AccountComponent, canDeactivate: [UnsavedDataGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
