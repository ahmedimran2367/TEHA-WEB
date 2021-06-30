import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { OverviewGridComponent } from './overview-grid/overview-grid.component';
import { EnterDataComponent } from './enter-data/enter-data.component';
import { EditDataComponent } from './edit-data/edit-data.component';
import { ReviewDataComponent } from './review-data/review-data.component';
import { OwnerDataComponent } from './owner-data/owner-data.component';
import { DataExchangeComponent } from './data-exchange/data-exchange.component';
import { UnsavedDataGuard } from 'src/app/core/guard/unsaved-data-guard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'overview',
    component: OverviewComponent,
    children: [
      {
        path: '',
        component: OverviewGridComponent
      },
      {
        path: 'enter/:id',
        component: EnterDataComponent, canDeactivate: [UnsavedDataGuard] ,
      },
      {
        path: 'enter',
        component: EnterDataComponent, canDeactivate: [UnsavedDataGuard] ,
      },
      {
        path: 'dataExchange',
        component: DataExchangeComponent
      },
      {
        path: 'edit',
        component: EditDataComponent
      },
      {
        path: 'review',
        component: ReviewDataComponent
      },
      {
        path: 'owner/:id',
        component: OwnerDataComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
