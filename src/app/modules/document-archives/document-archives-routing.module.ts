import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentArchivesComponent } from './overview/document-archives.component';
import { AllBuildingsInvoiceComponent } from './overview/invoice-table/all-buildings-invoice/all-buildings-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentArchivesComponent
  },
  {
    path: 'allbuildingsinvoice',
    component: AllBuildingsInvoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentArchivesRoutingModule { }
