import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from '../orders/dashboard/dashboard.component';
import { OrderWaterAnalysisComponent } from '../orders/order-water-analysis/order-water-analysis.component';
import { OrderInterimReadingComponent } from '../orders/order-interim-reading/order-interim-reading.component';
import { OrderPlumbingComponent } from '../orders/order-plumbing/order-plumbing.component';
import { OrderSmokeDetectorTestComponent } from '../orders/order-smoke-detector-test/order-smoke-detector-test.component';
import { OrderEnterIntermReadingComponent } from '../orders/order-enter-interm-reading/order-enter-interm-reading.component';
import { OrderOfferRequestComponent } from '../orders/order-offer-request/order-offer-request.component';
import { OrderEnergyPerformanceCertificateComponent } from './order-energy-performance-certificate/order-energy-performance-certificate.component';
import { UnsavedDataGuard } from 'src/app/core/guard/unsaved-data-guard.guard';
import { OrderReadingComponent } from './order-reading/order-reading.component';
const routes: Routes = [{ path: '', component: DashboardComponent },
{
  path: 'dashboard',
  component: DashboardComponent
},
{
  path: 'wateranalysis/:id',
  component: OrderWaterAnalysisComponent
},
{
  path: 'wateranalysis',
  component: OrderWaterAnalysisComponent
},
{
  path: 'interimreading/:id',
  component: OrderInterimReadingComponent
},
{
  path: 'interimreading',
  component: OrderInterimReadingComponent
},
{
  path: 'plumbing/:id',
  component: OrderPlumbingComponent
},
{
  path: 'plumbing',
  component: OrderPlumbingComponent
},
{
  path: 'smokedetector/:id',
  component: OrderSmokeDetectorTestComponent
},
{
  path: 'smokedetector',
  component: OrderSmokeDetectorTestComponent
},
{
  path: 'enterintermreading/:id',
  component: OrderEnterIntermReadingComponent,
  canDeactivate: [UnsavedDataGuard]
},
{
  path: 'enterintermreading',
  component: OrderEnterIntermReadingComponent,
  canDeactivate: [UnsavedDataGuard]
},
{
  path: 'offerrequest',
  component: OrderOfferRequestComponent
},
{
  path: 'energyperformancecertificate/:id',
  component: OrderEnergyPerformanceCertificateComponent,
  canDeactivate: [UnsavedDataGuard]
},
{
  path: 'energyperformancecertificate',
  component: OrderEnergyPerformanceCertificateComponent
},
{
  path: 'reading/:id',
  component: OrderReadingComponent
},
{
  path: 'reading',
  component: OrderReadingComponent
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
