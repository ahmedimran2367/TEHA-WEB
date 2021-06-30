import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlatComponent } from './flat/flat.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MetersComponent} from './meters/meters.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'flat',
    redirectTo: 'dashboard'
  },
  {
    path: 'flat/:id',
    component: FlatComponent
  },
  {
    path: 'allmeters',
    component: MetersComponent
  },
  {
    path: 'meters',
    redirectTo: 'dashboard'
  },
  {
    path: 'meters/:id',
    component: MetersComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockOverviewRoutingModule { }
