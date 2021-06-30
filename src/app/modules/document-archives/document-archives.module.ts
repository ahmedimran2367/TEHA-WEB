import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentArchivesComponent } from './overview/document-archives.component';
import { DocumentArchivesRoutingModule } from './document-archives-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InvoiceTableComponent } from './overview/invoice-table/invoice-table.component';
import { AllBuildingsInvoiceComponent } from './overview/invoice-table/all-buildings-invoice/all-buildings-invoice.component';
import { AccountingTableComponent } from './overview/accounting-table/accounting-table.component';
import { ReadingTableComponent } from './overview/reading-table/reading-table.component';
import { PlumbingTableComponent } from './overview/plumbing-table/plumbing-table.component';
import { EnergyCertificateTableComponent } from './overview/energy-certificate-table/energy-certificate-table.component';
import { AllDocumentTableComponent } from './overview/all-document-table/all-document-table.component';
import { DrinkingWaterTableComponent } from './overview/drinking-water-table/drinking-water-table.component';
import { SEPATableComponent } from './overview/sepa-table/sepa-table.component';

import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { YearSelectorComponentComponent } from './overview/year-selector-component/year-selector-component.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  imports: [
    CommonModule,
    DocumentArchivesRoutingModule,
    SharedModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  declarations: [
    DocumentArchivesComponent,
    InvoiceTableComponent,
    AccountingTableComponent,
    ReadingTableComponent,
    PlumbingTableComponent,
    EnergyCertificateTableComponent,
    DrinkingWaterTableComponent,
    AllDocumentTableComponent,
    SEPATableComponent,
    AllBuildingsInvoiceComponent,
    YearSelectorComponentComponent,
  ]
})
export class DocumentArchivesModule {}
