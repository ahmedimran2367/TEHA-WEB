import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  OrderEnergyPerformanceTableDataSource,
  OrderEnergyPerformanceTableItem,
} from './order-energy-performance-table/order-energy-performance-table-datasource';
import {
  HotWater,
  OrderEnergyPerformanceRequest,
  Periods,
  ThermalEnergy,
} from '../models/order-energy-performance-request.model';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { OrdersService } from '../services/orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { FileName, FilePath } from 'src/app/shared/Constant/PDF';
import { FileContentResponse } from '../../accounting/model/costData';
import { UtilityService } from 'src/app/shared/services/utility.service';
export interface ConsumptionForThermalEnergy {
  period: string;
  amount: string;
  unit: string;
  vacanyPercentage: number;
  dummy: string;
}

export interface HotWaterUsed {
  period: string;
  amount: string;
  unit: string;
  dummy: string;
}

@Component({
  selector: 'app-order-energy-performance-certificate',
  templateUrl: './order-energy-performance-certificate.component.html',
  styleUrls: ['./order-energy-performance-certificate.component.scss'],
})
export class OrderEnergyPerformanceCertificateComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) thermalEnergyConsumptionTable: MatTable<ThermalEnergy>;
  @ViewChild(MatTable) hotWaterUsedTable: MatTable<HotWater>;
  @ViewChild(MatTable) energyTable: MatTable<OrderEnergyPerformanceTableItem>;
  @ViewChild('buildingCard') buildingCard;
  @ViewChild('mapCard') mapCard;
  @ViewChild('firstForm') firstForm: FormGroup;
  @ViewChild('secondForm') secondForm;

  thermalEnergyTableDataSource: MatTableDataSource<ThermalEnergy>;
  hotWaterTableDataSource: MatTableDataSource<HotWater>;
  energyTableDataSource: OrderEnergyPerformanceTableDataSource;
  selectedBuilding: string;
  currentStep = 'STEP_2';
  isVacant = true;
  orderId: number = null;
  showPropertyCard = false;
  showHelloCard = false;
  showUserMap = false;
  showFlatCard = false;
  showMeterCard = false;
  showPropertySearch = true;
  thermalArray: Periods[] = [];
  hotWaterArray: Periods[] = [];
  propertyImages: FileContentResponse[] = [];
  showNextServiceInput = false;
  routID: any;
  tooltipText = '';
  datemask = [
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    '-',
    ' ',
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

  public customPatterns = { 0: { pattern: this.datemask } };
  orderEnergyPerformanceRequestNew = new OrderEnergyPerformanceRequest();
  orderEnergyPerformanceRequestCurrent = new OrderEnergyPerformanceRequest();
  thermalEnergyDisplayedColumns = [
    'period',
    'amount',
    'unit',
    'vacanyPercentage',
  ];

  hotWaterUsedDisplayedColumns = ['period', 'amount', 'unit'];

  displayedEnergyTableColumns = [
    'tehaUserno',
    'adminUserno',
    'street',
    'postCode',
    'city',
    'status',
    'issuanceDate',
    'exhibitionDate',
    'download',
    'actions',
  ];

  buildingTypes = [];
  // buildingTypes = [
  //   'Detached Family House',
  //   'Single-family Detached House',
  //   'Two-sided Detached House',
  //   'Detached Two-family House',
  //   'Two-family House Built on One Side',
  //   'Two-family House Built on Two Side',
  //   'Apartment Building',
  //   'Part of a mixed-use Building',
  // ];

  ngOnInit(): void {
    this.createRowsForThermalHotWater();
    this.orderId = history.state.orderId;
    this.currentStep = 'STEP_2';
    if (this.orderId) {
      this.browserService.setlocalStorage(
        'currentPropertyId',
        parseInt(history.state.propertyId)
      );
      this.displayCard('property');
      this.orderService.getEditEnergyPerformance(this.orderId, history.state.propertyId).subscribe(res => {
        this.orderEnergyPerformanceRequestNew = res.data;
        for (let i = 0; i < 3; i++) {
          const thermalDate = this.orderEnergyPerformanceRequestNew.thermalEnergy[i].period.split(' ');
          const hotWaterDate = this.orderEnergyPerformanceRequestNew.hotWater[i].period.split(' ');
          this.thermalArray[i].startDate = new Date(parseInt(thermalDate[0].split('/')[2]), parseInt(thermalDate[0].split('/')[1]), parseInt(thermalDate[0].split('/')[0]));
          this.thermalArray[i].endDate = new Date(parseInt(thermalDate[2].split('/')[2]), parseInt(thermalDate[2].split('/')[1]), parseInt(thermalDate[2].split('/')[0]));
          this.hotWaterArray[i].startDate = new Date(parseInt(hotWaterDate[0].split('/')[2]), parseInt(hotWaterDate[0].split('/')[1]), parseInt(hotWaterDate[0].split('/')[0]));
          this.hotWaterArray[i].endDate = new Date(parseInt(hotWaterDate[2].split('/')[2]), parseInt(hotWaterDate[2].split('/')[1]), parseInt(hotWaterDate[2].split('/')[0]));
        }

        this.thermalEnergyTableDataSource = new MatTableDataSource(
          this.orderEnergyPerformanceRequestNew.thermalEnergy
        );
        this.hotWaterTableDataSource = new MatTableDataSource(
          this.orderEnergyPerformanceRequestNew.hotWater
        );
        this.orderEnergyPerformanceRequestCurrent = JSON.parse(JSON.stringify(this.orderEnergyPerformanceRequestNew));
        if (this.orderEnergyPerformanceRequestCurrent.airConditionerInd) {
          this.showNextServiceInput = true;
        }
      }, (error) => {
        this.location.back();
        this.toastService.openSnackError(error.error.message);
      });
      { }
    } else {


      this.routID = this.route.snapshot.paramMap.get('id');
      if (this.routID != null) {
        this.route.paramMap.subscribe((paramMap) => {

          this.browserService.setlocalStorage(
            'currentPropertyId',
            parseInt(paramMap.get('id'))
          );
        });
        this.displayCard('property');
      }
      else {
        this.currentStep = 'STEP_1';
        this.displayCard('user');
      }

      this.orderEnergyPerformanceRequestCurrent = JSON.parse(
        JSON.stringify(this.orderEnergyPerformanceRequestNew)
      );
      this.energyTableDataSource = new OrderEnergyPerformanceTableDataSource();
      this.thermalEnergyTableDataSource = new MatTableDataSource(
        this.orderEnergyPerformanceRequestNew.thermalEnergy
      );
      this.hotWaterTableDataSource = new MatTableDataSource(
        this.orderEnergyPerformanceRequestNew.hotWater
      );
      this.getPrefillData();
      this.translate.get('order.chooseImage').subscribe((value) => {
        this.tooltipText = value;
      });
    }
  }
  getPrefillData(): void {
    this.orderService.GetEnergyCertificatePreFillData(this.browserService.getlocalStorage('currentPropertyId'))
      .subscribe(
        (m) => {
          this.orderEnergyPerformanceRequestNew.yearOfConstruction = m.data.yearOfConstruction;
          this.orderEnergyPerformanceRequestNew.heatableUsableArea = m.data.heatableUsableArea;
          this.orderEnergyPerformanceRequestNew.noOfResidentialUnits = m.data.noOfResidentialUnits;


          for (let i = 0; i < 3; i++) {
            const thermalDate = m.data.thermalEnergy[i].period?.split(' ');
            const hotWaterDate = m.data.hotWater[i].period?.split(' ');
            this.thermalArray[i].startDate = new Date(parseInt(thermalDate[0]?.split('/')[2]), parseInt(thermalDate[0]?.split('/')[1]), parseInt(thermalDate[0]?.split('/')[0]));
            this.thermalArray[i].endDate = new Date(parseInt(thermalDate[2]?.split('/')[2]), parseInt(thermalDate[2]?.split('/')[1]), parseInt(thermalDate[2]?.split('/')[0]));
            this.hotWaterArray[i].startDate = new Date(parseInt(hotWaterDate[0]?.split('/')[2]), parseInt(hotWaterDate[0]?.split('/')[1]), parseInt(hotWaterDate[0]?.split('/')[0]));
            this.hotWaterArray[i].endDate = new Date(parseInt(hotWaterDate[2]?.split('/')[2]), parseInt(hotWaterDate[2]?.split('/')[1]), parseInt(hotWaterDate[2]?.split('/')[0]));
          }
          this.orderEnergyPerformanceRequestNew.thermalEnergy = m.data.thermalEnergy;
          this.orderEnergyPerformanceRequestNew.hotWater = m.data.hotWater;
          this.thermalEnergyTableDataSource = new MatTableDataSource(
            this.orderEnergyPerformanceRequestNew.thermalEnergy
          );
          this.hotWaterTableDataSource = new MatTableDataSource(
            this.orderEnergyPerformanceRequestNew.hotWater
          );
        },
        () => {
          this.toastService.openSnackInfo('Order prefill data error!');
        }
      );
  }

  createRowsForThermalHotWater(): void {
    for (let index = 0; index < 3; index++) {
      this.orderEnergyPerformanceRequestNew.thermalEnergy.push({
        period: '',
        vacancyPercentage: null,
        unit: '',
        amount: null,
      });

      this.orderEnergyPerformanceRequestNew.hotWater.push({
        period: '',
        unit: '',
        amount: null,
      });
      this.thermalArray.push({
        startDate: null,
        endDate: null,
      });
      this.hotWaterArray.push({
        startDate: null,
        endDate: null,
      });
      // work portal improvements
      this.orderEnergyPerformanceRequestNew.imagesContents.push({
        content: null,
        filename: ''
      });
    }
  }
  updateCards($event): void {
    this.browserService.setlocalStorage('currentPropertyId', $event);
    this.orderEnergyPerformanceRequestNew = new OrderEnergyPerformanceRequest();
    this.orderEnergyPerformanceRequestCurrent = new OrderEnergyPerformanceRequest();
    this.getPrefillData();
    if (this.routID != null) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/orders/energyperformancecertificate', $event]);
      });
    }
    else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/orders/energyperformancecertificate']);
      });
    }
  }

  canDeactivate(): boolean {
    if (
      JSON.stringify(this.orderEnergyPerformanceRequestCurrent) !==
      JSON.stringify(this.orderEnergyPerformanceRequestNew)
    ) { return true; }

    else { return false; }
  }
  ngAfterViewInit(): void {
    this.energyTable.dataSource = this.energyTableDataSource;
    this.thermalEnergyConsumptionTable.dataSource = this.thermalEnergyTableDataSource;
    this.hotWaterUsedTable.dataSource = this.hotWaterTableDataSource;
  }

  constructor(
    private browserService: BrowserStorageService,
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private location: Location,
    private dialog: MatDialog,
    private router: Router,
    private translate: TranslateService,
    private utilityService: UtilityService,
  ) {
    this.translate
      .get([
        'order.building1',
        'order.building2',
        'order.building3',
        'order.building4',
        'order.building5',
        'order.building6',
        'order.building7',
        'order.building8',
      ])
      .subscribe((values) => {
        this.buildingTypes.push(values['order.building1']);
        this.buildingTypes.push(values['order.building2']);
        this.buildingTypes.push(values['order.building3']);
        this.buildingTypes.push(values['order.building4']);
        this.buildingTypes.push(values['order.building5']);
        this.buildingTypes.push(values['order.building6']);
        this.buildingTypes.push(values['order.building7']);
        this.buildingTypes.push(values['order.building8']);
      });
  }

  resetFirstForm(): void {
    this.orderEnergyPerformanceRequestNew = JSON.parse(
      JSON.stringify(this.orderEnergyPerformanceRequestCurrent)
    );
    // this.firstForm.markAsUntouched;
  }
  stepper(nextStep: string): void {
    if (nextStep === 'STEP_3') {
      for (let i = 0; i < this.orderEnergyPerformanceRequestNew.imagesContents.length; i++) {
        if (this.orderEnergyPerformanceRequestNew.imagesContents[i].content == null) {
          this.translate.get('order.imagesMissingMsg').subscribe((value) => {
            this.toastService.openSnackInfo(value);
          });
          return;
        }
      }
    }
    if (nextStep === 'STEP_4') {
      for (let i = 0; i < this.thermalArray.length; i++) {
        this.orderEnergyPerformanceRequestNew.thermalEnergy[i].period = this.getFormattedDate(this.thermalArray[i].startDate) + ' - ' + this.getFormattedDate(this.thermalArray[i].endDate);
      }
      for (let i = 0; i < this.hotWaterArray.length; i++) {
        this.orderEnergyPerformanceRequestNew.hotWater[i].period = this.getFormattedDate(this.hotWaterArray[i].startDate) + ' - ' + this.getFormattedDate(this.hotWaterArray[i].endDate);
      }
    }
    this.currentStep = nextStep;
  }

  resetSecondForm(): void {
    this.secondForm.markAsUntouched;
  }
  backToOrders(): void {
    this.resetFirstForm();
    this.resetSecondForm();
    this.router.navigate(['/orders/dashboard']);
  }
  submitOrder(): void {
    this.orderEnergyPerformanceRequestNew.propertyId = this.browserService.getlocalStorage(
      'currentPropertyId'
    );
    this.orderEnergyPerformanceRequestNew.noOfResidentialUnits = parseInt(this.orderEnergyPerformanceRequestNew.noOfResidentialUnits.toString());
    this.orderEnergyPerformanceRequestNew.heatableUsableArea = parseFloat(this.orderEnergyPerformanceRequestNew.heatableUsableArea.toString());
    this.orderEnergyPerformanceRequestNew.thermalEnergy.forEach(el => {
      el.amount = parseFloat(el.amount.toString());
      el.vacancyPercentage = parseFloat(el.vacancyPercentage.toString());
    });
    this.orderEnergyPerformanceRequestNew.hotWater.forEach(el => {
      el.amount = parseFloat(el.amount.toString());
    });
    this.orderEnergyPerformanceRequestNew.nextServiceDate = this.utilityService.setDateFormat(this.orderEnergyPerformanceRequestNew.nextServiceDate);
    this.orderService
      .orderEnergyPerformanceCertificate(this.orderEnergyPerformanceRequestNew)
      .subscribe(
        (m) => {
          this.stepper('STEP_6');
          this.orderEnergyPerformanceRequestNew = JSON.parse(
            JSON.stringify(this.orderEnergyPerformanceRequestCurrent)
          );
        },
        () => {
          this.translate.get('order.orderFailMsg').subscribe((value) => {
            this.toastService.openSnackInfo(value);
          });
        }
      );
  }
  goBack(): void {
    if (this.orderId && this.currentStep === 'STEP_2') {
      this.location.back();
    }
    if (this.currentStep === 'STEP_2' && this.routID === null) {
      this.currentStep = 'STEP_1';
      this.displayCard('user');
    }
    else if (this.currentStep === 'STEP_2' && this.routID != null) {
      this.router.navigate(['/stockoverview/dashboard']);
    }
    else {
      this.getStep();
    }
  }
  getStep(): void {
    let step = parseInt(this.currentStep[5]);
    step = step - 1;
    this.currentStep = 'STEP_' + step.toString();
  }

  getErrorThermalHotWater(id, name): any {
    if (this.secondForm) {
      if (this.secondForm.form.controls[name + id] == undefined) {
        return false;
      }
      return !this.secondForm.form.controls[name + id]?.valid && this.secondForm.form.controls[name + id]?.touched;
    }
    else {
      return false;
    }
  }
  cancelOrder(): void {
    if (this.canDeactivate()) {
      let dialogRef = this.dialog.open(DialogComponent, {
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog
        if (result == 'confirm') {
          this.resetFirstForm();
          this.location.back();
        }
      });
    }
    else {
      this.location.back();
    }
  }
  getFormattedDate(date: Date): any {
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    let yyyy = date.getFullYear();
    let result = dd + '/' + mm + '/' + yyyy;
    return result;
  }
  displayCard(type): void {
    if (type === 'user') {
      this.showHelloCard = true;
      this.showUserMap = true;
      this.showPropertySearch = false;
      this.showPropertyCard = false;
    }
    else {
      this.showHelloCard = false;
      this.showUserMap = false;
      this.showPropertySearch = true;
      this.showPropertyCard = true;
    }
  }
  gotoOrderForm(event): void {
    this.resetFirstForm();
    this.resetSecondForm();
    this.currentStep = 'STEP_2';
    this.displayCard('property');
    this.getPrefillData();
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
  attachImage(e, index): any {
    let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    if (parseFloat(sizeInMB) > 5) {
      alert('File size must under 5MB!');
      return;
    }
    let pattern = /image-*/;
    let reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(
      this,
      file.name,
      index,
    );
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(filename, index, e): any {
    let reader = e.target;
    // this.orderEnergyPerformanceRequestNew.imagesContents = new FileContentResponse[3];
    this.orderEnergyPerformanceRequestNew.imagesContents[index].content = reader.result.split('base64,')[1];
    this.orderEnergyPerformanceRequestNew.imagesContents[index].filename = filename;
  }
  showimage(base64, name): any {
    if (name == undefined || name == null) {
      return base64;
    }
    let url = '';
    let jpg = /jpg|JPG-*/;
    let png = /png|PNG-*/;
    let jpeg = /jpeg|JPEG-*/;
    if (name.match(png)) {
      url = 'data:image/png;base64,';
    } else if (name.match(jpg)) {
      url = 'data:image/jpg;base64,';
    } else if (name.match(jpeg)) {
      url = 'data:image/jpeg;base64,';
    } else {
      return null;
    }
    return url + base64;
  }
  valueChange(event): void {
    if (event.value == true) {
      this.showNextServiceInput = true;
    } else { this.showNextServiceInput = false; this.orderEnergyPerformanceRequestNew.nextServiceDate = null; }

  }
}
