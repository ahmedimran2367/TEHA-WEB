import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { OfferRequestTableDataSource, OfferRequestTableItem } from './offer-request-table/offer-request-table-datasource';
import { OrdersService } from '../services/orders.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { Location } from '@angular/common';
import { OfferRequestFormComponent } from './offer-request-form/offer-request-form.component';
import { OfferRequest } from '../models/offerRequest';
import { FileName, FilePath } from 'src/app/shared/Constant/PDF';
@Component({
  selector: 'app-order-offer-request',
  templateUrl: './order-offer-request.component.html',
  styleUrls: ['./order-offer-request.component.scss']
})
export class OrderOfferRequestComponent implements OnInit, AfterViewInit, OnDestroy {
  isDivHidden = false;
  isDiv2Hidden = false;
  orderId: number = null;
  @ViewChild(MatTable) table: MatTable<OfferRequestTableItem>;
  dataSource: OfferRequestTableDataSource;
  @ViewChild('offerMainForm') formComponent: OfferRequestFormComponent;
  currentStep = 'STEP_1';

  displayedColumns = [
    'userName',
    'newPropertyAddress',
    'contractType',
    'serviceType',
    'measurementTechnology',
    'requiredMeters'
  ];

  constructor(
    public ordersService: OrdersService,
    private router: Router,
    private toasService: ToastService,
    private location: Location) { }

  ngOnInit(): void {
    this.dataSource = new OfferRequestTableDataSource();
    this.orderId = history.state.orderId;
    this.currentStep = 'STEP_1';
    if (this.orderId) {
      this.ordersService.getEditOfferRequest(this.orderId).subscribe(res => {
        this.ordersService.offerRequestObj = res.data;
      }, (error) => {
        this.location.back();
        this.toasService.openSnackError(error.error.message);
      });

    }
  }

  ngAfterViewInit(): void {
  }

  stepper(nextStep: string): void {
    if (this.currentStep == 'STEP_1') {
      this.currentStep = nextStep;
    }
    else {
      this.currentStep = nextStep;
    }
  }

  backToOrders(): void {
    this.router.navigate(['/orders']);
  }
  arrowBack(): void {
    for (let a = 2; a < 5; a++) {
      if ('STEP_' + a == this.currentStep) {
        this.currentStep = 'STEP_' + (a - 1);
      }
    }
  }
  cancel(): void {
    if (this.currentStep == 'STEP_1') {
      this.router.navigate(['/orders']);
    }
    else if (this.currentStep == 'STEP_2') {
      this.currentStep = 'STEP_1';
    }
    else if (this.currentStep == 'STEP_3') {
      this.currentStep = 'STEP_2';
    }
  }
  save(): void {
    if (this.validate()) {
      this.ordersService
        .requestOffer()
        .subscribe((data) => {
          this.currentStep = 'STEP_4';
          this.formComponent.entryForm.resetForm();
          this.ordersService.offerRequestObj = new OfferRequest();
        }, error => {
          this.toasService.openSnackError(error.error.message);
        });
    }
  }
  validate(): boolean {
    return true;
  }
  ngOnDestroy(): void {
    this.ordersService.offerRequestObj = new OfferRequest();
  }
  cancelOrder(): void {
    this.ordersService.offerRequestObj = new OfferRequest();
    this.location.back();
  }
  downloadPDF(): void {
    this.downloadFile(FileName.commonPDF, FilePath.commonPDF);
  }
  downloadFile(name, path): void {
    const link = document.createElement('a');
    link.download = name;
    link.href = path;
    link.click();
  }
}
