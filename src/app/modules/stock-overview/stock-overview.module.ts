import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockOverviewRoutingModule } from './stock-overview-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InprogressComponent } from '../stock-overview/dashboard/inprogress/inprogress.component';
import { PropertyTableComponent } from '../stock-overview/dashboard/property-table/property-table.component';
import { StockoverviewComponent } from '../stock-overview/dashboard/stockoverview/stockoverview.component';
import { FlatComponent } from './flat/flat.component';
import { FlatOverviewTableComponent } from '../stock-overview/flat/flat-overview-table/flat-overview-table.component';
import { MetersComponent } from './meters/meters.component';
import {MetersTableComponent} from './meters/meters-table/meters-table.component';

@NgModule({
  declarations: [
    DashboardComponent,
    InprogressComponent,
    PropertyTableComponent,
    StockoverviewComponent,
    FlatComponent,
    FlatOverviewTableComponent,
    MetersComponent,
    MetersTableComponent,
  ],
  imports: [
    CommonModule,
    StockOverviewRoutingModule,
    SharedModule
  ]
})
export class StockOverviewModule { }
