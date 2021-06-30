import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountingRoutingModule } from './accounting-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { OverviewComponent } from './overview/overview.component';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { OverviewGridComponent } from './overview-grid/overview-grid.component';
import { ReviewDataComponent } from './review-data/review-data.component';
import { EditDataComponent } from './edit-data/edit-data.component';
import { EnterDataComponent } from './enter-data/enter-data.component';
import { CostDataComponent } from './cost-data/cost-data.component';
import { UserDataComponent } from './user-data/user-data.component';
import { OwnerDataComponent } from './owner-data/owner-data.component';
import { SummaryComponent } from './summary/summary.component';
import { AccountingYearSelectorComponent } from './accounting-year-selector/accounting-year-selector.component';
import { DataExchangeComponent } from './data-exchange/data-exchange.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    OverviewComponent,
    OverviewGridComponent,
    ReviewDataComponent,
    EditDataComponent,
    EnterDataComponent,
    CostDataComponent,
    UserDataComponent,
    OwnerDataComponent,
    SummaryComponent,
    AccountingYearSelectorComponent,
    DataExchangeComponent,
  ],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    SharedModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
  ],
})
export class AccountingModule {}
