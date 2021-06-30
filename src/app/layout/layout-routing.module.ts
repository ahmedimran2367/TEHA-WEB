import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guard/auth.guard';
import { ContentComponent } from './content/content.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../modules/home/home.module').then((m) => m.HomeModule),
          canActivate: [AuthGuard]
      },
      {
        path: 'stockoverview',
        loadChildren: () =>
          import('../modules/stock-overview/stock-overview.module').then(
            (m) => m.StockOverviewModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'accounting',
        loadChildren: () =>
          import('../modules/accounting/accounting.module').then(
            (m) => m.AccountingModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'documentarchives',
        loadChildren: () =>
          import('../modules/document-archives/document-archives.module').then(
            (m) => m.DocumentArchivesModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('../modules/orders/orders.module').then((m) => m.OrdersModule),
          canActivate: [AuthGuard]
      },
      {
        path: 'myprofile',
        loadChildren: () =>
          import('../modules/account/account.module').then(
            (m) => m.AccountModule
          ),
          canActivate: [AuthGuard],
      },
      {
        path: 'mycontactpeople',
        loadChildren: () =>
          import('../modules/mycontactpeople/mycontactpeople.module').then(
            (m) => m.MycontactpeopleModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'staticpages',
        loadChildren: () =>
          import('../modules/static-pages/static-pages.module').then(
            (m) => m.StaticPagesModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('../modules/admin/admin.module').then(
            (m) => m.AdminModule
          ),
          canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('../modules/auth/auth.module').then((m) => m.AuthModule),
  },
  // Fallback when no prior routes is matched
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
