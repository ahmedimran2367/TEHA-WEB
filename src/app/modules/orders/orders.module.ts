import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderWaterAnalysisComponent } from './order-water-analysis/order-water-analysis.component';
import { OrderInterimReadingComponent } from './order-interim-reading/order-interim-reading.component';
import { OrderPlumbingComponent } from './order-plumbing/order-plumbing.component';

import { OrderTableComponent } from './dashboard/order-table/order-table.component';
import { OrderSmokeDetectorTestComponent } from './order-smoke-detector-test/order-smoke-detector-test.component';
import { OrderEnterIntermReadingComponent } from './order-enter-interm-reading/order-enter-interm-reading.component';
import { OrderOfferRequestComponent } from './order-offer-request/order-offer-request.component';
import { OfferRequestFormComponent } from './order-offer-request/offer-request-form/offer-request-form.component';
import { OrderPlumbingTableComponent } from './order-plumbing/order-plumbing-table/order-plumbing-table.component';
import { OrderPlumbingFOrmComponent } from './order-plumbing/order-plumbing-form/order-plumbing-form.component';
import { OrderPlumbingTableTwoComponent } from './order-plumbing/order-plumbing-table-two/order-plumbing-table-two.component';
import { OrderEnergyPerformanceCertificateComponent } from './order-energy-performance-certificate/order-energy-performance-certificate.component';
import { OrderEnergyPerformanceTableComponent } from './order-energy-performance-certificate/order-energy-performance-table/order-energy-performance-table.component';
import { OfferRequestTableComponent } from './order-offer-request/offer-request-table/offer-request-table.component';
import { AmountOfHotWaterUsedTableComponent } from './order-energy-performance-certificate/amount-of-hot-water-used-table/amount-of-hot-water-used-table.component';
import { ConsumptionOfThermalEnergyTableComponent } from './order-energy-performance-certificate/consumption-of-thermal-energy-table/consumption-of-thermal-energy-table.component';
import { OderWaterAnalysisNewBuildingComponent } from './order-water-analysis/components/oder-water-analysis-new-building/oder-water-analysis-new-building.component';
import { OderWaterAnalysisSummaryComponent } from './order-water-analysis/components/oder-water-analysis-summary/oder-water-analysis-summary.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OrderReadingComponent } from './order-reading/order-reading.component';
import { OfferRequestFormSummaryComponent } from './order-offer-request/offer-request-form-summary/offer-request-form-summary.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { OrderSmokeDetectorPropertyTableComponent } from './order-smoke-detector-test/order-smoke-detector-property-table/order-smoke-detector-property-table.component';
import { OrderReadingPropertyTableComponent } from './order-reading/order-reading-property-table/order-reading-property-table.component';
import { OrderEnergyCertificatePropertyTableComponent } from './order-energy-performance-certificate/order-energy-certificate-property-table/order-energy-certificate-property-table.component';
import { OrderWaterAnalysisPropertyTableComponent } from './order-water-analysis/components/order-water-analysis-property-table/order-water-analysis-property-table.component';
import { OrderPlumbingPropertyTableComponent } from './order-plumbing/order-plumbing-property-table/order-plumbing-property-table.component';
import { OrderInterimPropertyTableComponent } from './order-interim-reading/order-interim-property-table/order-interim-property-table.component';
import { OrderEnterEnterimPropertyTableComponent } from './order-enter-interm-reading/order-enter-enterim-property-table/order-enter-enterim-property-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [
    DashboardComponent,
    OrderWaterAnalysisComponent,
    OrderInterimReadingComponent,
    OrderPlumbingComponent,
    OrderTableComponent,
    OrderSmokeDetectorTestComponent,
    OrderEnterIntermReadingComponent,
    OrderOfferRequestComponent,
    OfferRequestFormComponent,
    OrderPlumbingTableComponent,
    OrderPlumbingFOrmComponent,
    OrderPlumbingTableTwoComponent,
    OrderEnergyPerformanceCertificateComponent,
    OrderEnergyPerformanceTableComponent,
    OfferRequestTableComponent,
    AmountOfHotWaterUsedTableComponent,
    ConsumptionOfThermalEnergyTableComponent,
    OderWaterAnalysisNewBuildingComponent,
    OderWaterAnalysisSummaryComponent,
    OfferRequestFormSummaryComponent,
    OrderReadingComponent,
    OrderSmokeDetectorPropertyTableComponent,
    OrderReadingPropertyTableComponent,
    OrderEnergyCertificatePropertyTableComponent,
    OrderWaterAnalysisPropertyTableComponent,
    OrderPlumbingPropertyTableComponent,
    OrderInterimPropertyTableComponent,
    OrderEnterEnterimPropertyTableComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    MatTooltipModule,
    NgxDaterangepickerMd.forRoot()
  ]
})
export class OrdersModule {}
