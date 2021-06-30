import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { OrdersService } from '../../../services/orders.service';
import { Location } from '@angular/common';
import { FileName, FilePath } from 'src/app/shared/Constant/PDF';
@Component({
  selector: 'app-oder-water-analysis-summary',
  templateUrl: './oder-water-analysis-summary.component.html',
  styleUrls: ['./oder-water-analysis-summary.component.scss']
})
export class OderWaterAnalysisSummaryComponent implements OnInit, AfterViewInit {

  @Input('drinkingWaterInd') drinkingWaterInd: boolean;
  @Output('hideSummary') hideSummary: EventEmitter<any> = new EventEmitter<boolean>();
  currentStep = 'STEP_1';
  tableTwoDataSource: any;
  property: any;
  DisplayedColumns = [
    'tehaLgNo',
    'adminLgNo',
    'street',
    'postcode',
    'place'
  ];
  constructor(
    private router: Router,
    private browserService: BrowserStorageService,
    public orderService: OrdersService,
    private toasService: ToastService,
    private location: Location) { }

  ngOnInit(): void {
    const properties = this.browserService.getSessionStorage('userProperties');
    this.property = properties?.find(
      (p) => p.id === this.browserService.getlocalStorage('currentPropertyId')
    );
  }

  ngAfterViewInit(): void {
    this.tableTwoDataSource = [this.property];
  }

  backToOrders(): void {
    this.router.navigate(['/orders']);
  }

  TestButton(): void {
    this.currentStep = 'STEP_2';
  }

  stepper(nextStep: string): void {
    this.currentStep = nextStep;
  }
  arrowBack(): void {
    if (this.drinkingWaterInd) {
      this.router.navigate(['/orders']);
      return;
    }
    this.hideSummary.emit(true);
  }
  backToOrder(): void {
    this.router.navigate(['/orders']);
  }
  save(): void {
    if (this.validate()) {
      this.orderService
        .RequestDrinkingWaterSampling()
        .subscribe((data) => {
          console.log(data);
          this.currentStep = 'STEP_2';
        }, error => {
          this.toasService.openSnackError(error.error.title);
        });
    }
  }
  validate(): boolean {
    return true;
  }
  cancelOrder(): void {
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
