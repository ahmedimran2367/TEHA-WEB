import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { LookUps } from 'src/app/shared/models/Lookup';
import { ResponseStatus } from 'src/app/shared/models/Response';
import { User } from 'src/app/shared/models/user.model';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FlatRequest } from '../../stock-overview/models/flat-request.model';
import { Meter } from '../../stock-overview/models/meter.model';
import { StockOverviewService } from '../../stock-overview/stock-overview.service';
import { AlternativePerson } from '../models/order-plumbing-request.model';
import { CommunicationMode, DateRange, TimeRange } from '../models/readingRequest';
import { SmokeDetectorRequest, ContactPerson } from '../models/smokeDetectorRequest';
import { OrderFlatTableItem } from '../models/orderFlatTableItem';
import { OrdersService } from '../services/orders.service';
import { OrderSmokeDetectorSummaryTableItem } from '../models/orderSmokeDetectorSummaryTableItem';
import { OrderMeterTableItem } from '../models/orderMeterTableItem';
import { OrderSmokeDetectorTableItem } from '../models/orderSmokeDetectorTableItem';
import { MatPaginator } from '@angular/material/paginator';
import { PropertyTableItem } from '../../stock-overview/dashboard/property-table/property-table-datasource';
import { TranslateService } from '@ngx-translate/core';
import { FileName, FilePath, MeterType } from 'src/app/shared/Constant/PDF';
@Component({
  selector: 'app-order-smoke-detector-test',
  templateUrl: './order-smoke-detector-test.component.html',
  styleUrls: ['./order-smoke-detector-test.component.scss']
})
export class OrderSmokeDetectorTestComponent implements OnInit, AfterViewInit {
  user: User;
  meterIds: number[] = [];
  propertyList: any[];
  property: any;
  reason: any;
  isMeterOrFlatLevel: boolean;
  isMeter = false;
  isFlat = false;
  plumbingReason: LookUps[] = [];
  isOverviewCardHidden = false;
  flatRequest: FlatRequest;
  public smokeDetectorRequest: SmokeDetectorRequest = new SmokeDetectorRequest();
  public preferredTimeRange: TimeRange = new TimeRange();
  public alternativeDateRange: DateRange = new DateRange();
  public communicationMode = new CommunicationMode();
  public alternativePerson = new ContactPerson();
  @ViewChild(MatTable) table: MatTable<OrderSmokeDetectorTableItem>;
  @ViewChild(MatTable) summaryTable: MatTable<OrderSmokeDetectorSummaryTableItem>;
  dataSource: MatTableDataSource<OrderFlatTableItem>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) propertyPaginator: MatPaginator;
  @ViewChild('firstForm') firstForm;
  summaryDataSource: MatTableDataSource<OrderSmokeDetectorSummaryTableItem>;
  meterLevelsummaryDataSource: MatTableDataSource<OrderSmokeDetectorSummaryTableItem>;
  orderSummary: OrderSmokeDetectorSummaryTableItem = new OrderSmokeDetectorSummaryTableItem();
  propertyDataSource: MatTableDataSource<PropertyTableItem>;
  floatLabelControl = new FormControl('auto');
  isVacant = false;
  disableInput = false;
  currentStep = 'STEP_1';
  btnDisabled = true;
  meterId: number;
  flatId: number;
  routId: number;
  currentFlatId: number;
  currentMeter: Meter;
  testLevel = '';
  orderLevel = false;
  metersDataSource: MatTableDataSource<OrderMeterTableItem>;
  pageSize = 10;
  today: Date = new Date();
  length: number;
  showMeterCard = false;
  showFlatCard = false;
  showPropertyCard = false;
  showHelloCard = false;
  showUserMap = false;
  showPropertySearch = true;
  @ViewChild('meterCard') meterCard;
  public toMin: any = '07:30 am';
  showTelephoneInput = false;
  showEmailInput = false;
  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#fff',
      buttonColor: '#6c6c6c'
    },
    dial: {
      dialBackgroundColor: '#fff',
      dialInactiveColor: '#c5c5c5',
      dialActiveColor: '#6c6c6c'
    },
    clockFace: {
      clockFaceBackgroundColor: '#f0f0f0',
      clockHandColor: '#6c6c6c',
      clockFaceTimeInactiveColor: '#6c6c6c'
    }
  };
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedMetersColumns = [
    'serialNumber',
    'meterTypeDesc',
    'location',
    'actions'
  ];
  displayedColumns = [
    'tehaUserNo',
    'adminUserNo',
    'tenantName',
    'location',
    'actions'
  ];
  displayedSummaryColumns = [
    'tehalgno',
    'adminlgno',
    'meterType',
    'address',
    'ordercreationdate',
  ];
  displayedMeterLevelSummaryColumns = [
    'tehalgno',
    'adminlgno',
    'serialNumber',
    'meterType',
    'address',
    'ordercreationdate',
  ];
  displayedPropertyColumns = [
    'tehalgno',
    'adminlgno',
    'street',
    'postcode',
    'place',
  ];
  currentPropertyId: number;
  routeSub: any;
  orderId: number = null;
  selectedFlat: any;
  constructor(
    private ordersService: OrdersService,
    private browserService: BrowserStorageService,
    private authenticationService: AuthenticationService,
    private stockOverviewService: StockOverviewService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    public defaultDataService: DefaultDataService,
    private utilityService: UtilityService,
    private location: Location,
    private translate: TranslateService) {

    this.authenticationService.currentUser.subscribe((u) => {
      if (u != null) {
        this.user = u;
      }
    });

    this.flatRequest = {
      userId: this.user.id,
      propertyIds: [],
      flatIds: [],
      includeChildren: false,
    };
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }

  ngOnInit(): void {
    this.orderId = history.state.orderId;

    this.currentStep = 'STEP_3';
    if (this.orderId) {
      this.ordersService.getEditSmokeDetectorTest(this.orderId, history.state.propertyId).subscribe(res => {
        this.smokeDetectorRequest = res.data;
        if (this.smokeDetectorRequest.propertyId) {
          this.browserService.setlocalStorage('currentPropertyId', this.smokeDetectorRequest.propertyId);
        }

        if (this.smokeDetectorRequest.alternativePerson) {
          this.isVacant = true;
          this.disableInput = true;
        }
        this.alternativePerson = JSON.parse(JSON.stringify(this.smokeDetectorRequest.alternativePerson));
        this.preferredTimeRange = JSON.parse(JSON.stringify(this.smokeDetectorRequest.preferredTimeRange));
        this.alternativeDateRange = JSON.parse(JSON.stringify(this.smokeDetectorRequest.alternativeDateRange));
        this.communicationMode = JSON.parse(JSON.stringify(this.smokeDetectorRequest.communicationMode));
        if (this.alternativePerson.firstName == null && this.alternativePerson.lastName == null) {
          this.isVacant = false;
          this.disableInput = false;
        }
        else {
          this.isVacant = true;
          this.disableInput = true;
        }
        if (this.communicationMode.smsInd) {
          this.showTelephoneInput = true;
        }
        if (this.communicationMode.letterInd) {
          this.showEmailInput = true;
        }
        if (res.data.meterId) {
          this.meterId = res.data.meterId;
          this.flatId = res.data.flatId;
          this.getFlatsMeters(this.smokeDetectorRequest.propertyId, this.smokeDetectorRequest.flatId);
          this.testLevel = 'Meter';
        } else if (res.data.flatId) {
          this.flatId = res.data.flatId;
          this.getFlatsMeters(this.smokeDetectorRequest.propertyId, this.smokeDetectorRequest.flatId);
          this.testLevel = 'Flat';
          this.displayCard('flat');
        } else {
          this.displayCard('property');
        }
      }, (error) => {
        this.location.back();
        this.toastService.openSnackError(error.error.message);
      });
    } else {
      this.displayCard('property');
      this.routeSub = this.route.params.subscribe(params => {
        this.routId = Number(params['id']) || 0;
      });
      this.currentPropertyId = this.browserService.getlocalStorage('currentPropertyId');
      this.flatId = this.browserService.getlocalStorage('currentFlatId');
      this.testLevel = this.browserService.getlocalStorage('testLevel');
      if (this.testLevel === 'Flat') {
        this.flatId = this.routId;
        this.meterId = null;
        this.orderLevel = true;
        this.displayCard('flat');
      }
      if (this.testLevel === 'Meter') {
        this.meterId = this.routId;
        this.flatId = this.browserService.getlocalStorage('currentFlatId');
        this.isMeter = true;
        this.displayCard('meter');
        this.meterCard?.updateCard(this.meterId);
      }

      if (this.routId != 0) {
        this.currentStep = 'STEP_3';
      }
      else {
        this.currentStep = 'STEP_0';
        this.displayCard('user');
        this.flatRequest.propertyIds.push(this.browserService.getlocalStorage('currentPropertyId'));
        this.stockOverviewService.getFlatsByProperyty(this.flatRequest).subscribe(data => {
          this.dataSource = new MatTableDataSource();
          this.dataSource = new MatTableDataSource(data.data.items);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.stockOverviewService.flatData = data.data.items;
        }, err => console.log(err));
      }

      this.meterIds.push(this.meterId);
      this.stockOverviewService.getFlats(this.browserService.getlocalStorage('currentPropertyId'), this.flatId, false).subscribe(data => {
        this.selectedFlat = data.data.items[0];
      });
      this.currentMeter = this.stockOverviewService.meterData?.find(m => m.id === this.meterId);
      this.defaultDataService.DefaultData.lookUps.plumbingReason.forEach(element => {
        if (element.value.charAt(0) === '*') {
          element.value = element.value.substr(1);
        }

      });
    }
  }

  ngAfterViewInit(): void {
  }

  showOverviewCard(): void {
    this.isOverviewCardHidden = false;
  }

  hideOverviewCard(): void {
    this.isOverviewCardHidden = true;
  }

  stepper(nextStep: string): void {
    if (nextStep === 'STEP_4') {
      if ((this.alternativeDateRange.from !== null && this.alternativeDateRange.to !== null) && this.alternativeDateRange.from > this.alternativeDateRange.to) {
        this.translate.get('order.alternativeDateErrorMsg').subscribe((value) => {
          this.toastService.openSnackError(value);
        });
        return;
      }
    }
    this.currentStep = nextStep;
    this.propertyList = this.browserService.getSessionStorage('userProperties');
    this.property = this.propertyList.find(
      p => p.id === this.browserService.getlocalStorage('currentPropertyId'));
    // Prepare summary object
    if (this.meterId != 0 && this.meterId != null) {
      this.isMeter = true;
      this.isFlat = false;
    }
    else {
      this.isFlat = true;
      this.isMeter = false;
    }
    this.orderSummary.adminlgno = this.property.adminLgNo;
    this.orderSummary.tehalgno = this.property.tehaLgNo;
    this.orderSummary.reason = this.smokeDetectorRequest.reason;
    this.orderSummary.meterType = 'RWM';
    this.orderSummary.address = this.property.street + ',' + this.property.postcode + ',' + this.property.place;
    this.orderSummary.ordercreationdate = new Date();
    const orderSummaryList = new Array<OrderSmokeDetectorSummaryTableItem>();
    orderSummaryList.push(this.orderSummary);
    this.summaryDataSource = new MatTableDataSource(orderSummaryList);
    if (this.meterId > 0) {
      this.currentMeter = this.stockOverviewService.meterData?.find(m => m.id === this.meterId);
      if (this.currentMeter) {
        this.orderSummary.serialNumber = this.currentMeter.serialNumber;
      }
      const orderMetersSummaryList = new Array<OrderSmokeDetectorSummaryTableItem>();
      orderMetersSummaryList.push(this.orderSummary);
      this.meterLevelsummaryDataSource = new MatTableDataSource(orderMetersSummaryList);
    }


    if (this.currentStep === 'STEP_5') {
      this.currentStep = 'STEP_4';
      this.alternativeDateRange.from = this.utilityService.setDateFormat(this.alternativeDateRange.from);
      this.alternativeDateRange.to = this.utilityService.setDateFormat(this.alternativeDateRange.to);
      this.smokeDetectorRequest.appointmentDate = this.utilityService.setDateFormat(this.smokeDetectorRequest.appointmentDate);
      this.preferredTimeRange.from = this.utilityService.convertTime12to24(this.preferredTimeRange.from);
      this.preferredTimeRange.to = this.utilityService.convertTime12to24(this.preferredTimeRange.to);
      this.smokeDetectorRequest.alternativePerson = this.alternativePerson;
      this.smokeDetectorRequest.preferredTimeRange = this.preferredTimeRange;
      this.smokeDetectorRequest.alternativeDateRange = this.alternativeDateRange;
      this.smokeDetectorRequest.communicationMode = this.communicationMode;
      this.smokeDetectorRequest.propertyId = this.browserService.getlocalStorage('currentPropertyId');
      this.smokeDetectorRequest.userId = this.user.id;

      if (!this.orderId) {
        this.smokeDetectorRequest.flatId = this.flatId;
        this.smokeDetectorRequest.meterId = this.meterId;
      }



      if (!this.isVacant) {
        const defaultContactPerson: ContactPerson = new ContactPerson();

        this.smokeDetectorRequest.alternativePerson = defaultContactPerson;
      }
      this.ordersService.RequestSmokeDetectorTest(this.smokeDetectorRequest).subscribe(res => {
        if (res.status == ResponseStatus.OK) {
          this.currentStep = 'STEP_5';
        }
        else {
          this.currentStep = 'STEP_4';
          this.toastService.openSnackError(res.message);
        }
      },

        (err) => {
          this.currentStep = 'STEP_4';
          console.log(err);
          this.toastService.openSnackError(err.message);
        }
      );
      this.btnDisabled = true;
    }
  }
  backToOrders(): void {
    this.smokeDetectorRequest = new SmokeDetectorRequest();
    this.router.navigate(['/orders/dashboard']);
  }
  showOptions(event): void {
    if (event.checked) {
      this.disableInput = true;
    }
    else {
      this.alternativePerson = new AlternativePerson();
      this.disableInput = false;
    }
  }
  resetForm(): void {
    this.firstForm.resetForm();
  }
  placeOrder(id): void {
    this.resetForm();
    this.currentStep = 'STEP_3';
    this.flatId = id;
    this.displayCard('flat');
    this.stockOverviewService.flatId = id;
  }
  placeOrderMeterLevel(id): void {
    this.resetForm();
    this.currentStep = 'STEP_3';
    this.meterId = id;
    this.isMeter = true;
    this.displayCard('meter');
  }
  propertyChange(id): void {
    this.browserService.setlocalStorage('currentPropertyId', id);
    if (this.testLevel == 'Flat') {
      this.resetForm();
      this.smokeDetectorRequest = new SmokeDetectorRequest();
      this.displayFlatsGrid(true);
      this.isFlat = true;
      this.isMeter = false;
    }
    else if (this.testLevel == 'Meter') {
      this.resetForm();
      this.smokeDetectorRequest = new SmokeDetectorRequest();
      this.displayFlatsGrid(true);
      this.isFlat = false;
      this.isMeter = true;
    }
  }
  handleStep1Click(id): void {
    this.currentStep = 'STEP_2';
    this.displayCard('flat');
    if (id) {
      const allLocaions = this.defaultDataService.DefaultData.lookUps.location;
      const metersTypes = this.defaultDataService.DefaultData.lookUps.measuringInstrumentType;
      this.stockOverviewService.getFlats(this.browserService.getlocalStorage('currentPropertyId'), id, true).subscribe(m => {
        this.metersDataSource = new MatTableDataSource();
        this.metersDataSource = new MatTableDataSource(m.data.items[0].meters.filter(item => item.meterTypeDesc === 'RWM'));
        this.metersDataSource.sort = this.sort;
        this.metersDataSource.paginator = this.paginator;
        this.stockOverviewService.meterData = m.data.items[0].meters;
        this.metersDataSource.data.forEach(element => {
          metersTypes.forEach(type => {
            if (element?.meterTypeDesc === type?.value) {
              element.meterTypeDesc = type?.code;
            }
          });
          allLocaions.forEach(innerElement => {
            if (element.location === innerElement.code) {
              element.location = innerElement.value;
            }
          });

        });

      });
      this.flatId = id;
      this.stockOverviewService.flatId = id;
    }

  }
  getFlatsMeters(propertyId, flatId): void {
    this.stockOverviewService
      .getFlats(propertyId, flatId, true)
      .subscribe(res => {
        this.stockOverviewService.flatId = flatId;
        this.stockOverviewService.meterData = res.data.items[0].meters;
        this.stockOverviewService.flatData = res.data.items;
        if (this.testLevel == 'Meter') {
          this.displayCard('meter');
          this.meterCard?.updateCard(this.meterId);
        }
        else if (this.testLevel == 'Flat') {
          this.displayCard('flat');
        }
      });
  }
  goBack(): void {
    if (this.orderId && this.currentStep === 'STEP_3') {
      this.router.navigate(['/orders']);
    }
    else if (this.testLevel === 'Flat' && this.currentStep === 'STEP_3' && this.routId != 0) {
      this.router.navigate(['/stockoverview/flat', this.browserService.getlocalStorage('currentPropertyId')]);
    }
    else if (this.testLevel === 'Meter' && this.currentStep === 'STEP_3' && this.routId != 0 && this.flatId == null) {
      this.router.navigate(['/stockoverview/allmeters'], { state: { allMeters: true } });
    }
    else if (this.testLevel === 'Meter' && this.currentStep === 'STEP_3' && this.routId != 0) {
      this.router.navigate(['/stockoverview/meters', this.flatId]);
    }
    else if (this.testLevel === 'Meter' && this.currentStep === 'STEP_1' && this.routId == 0) {
      this.currentStep = 'STEP_0';
      this.displayCard('user');
    }
    else if (this.testLevel === 'Flat' && this.currentStep === 'STEP_1' && this.routId == 0) {
      this.currentStep = 'STEP_0';
      this.displayCard('user');
    }
    else if (this.testLevel === 'Flat' && this.currentStep === 'STEP_3' && this.routId == 0) {
      this.currentStep = 'STEP_1';
      this.displayCard('property');
    }
    else {
      let step = parseInt(this.currentStep[5]);
      step = step - 1;
      this.currentStep = 'STEP_' + step.toString();
      if (this.currentStep === 'STEP_2' && this.meterId != null) {
        this.displayCard('flat');
      }
      else if (this.currentStep === 'STEP_1') {
        this.displayCard('property');
      }
      else if (this.currentStep === 'STEP_3' && this.routId != 0 && this.flatId != null) {
        this.displayCard('flat');
      }
      else if (this.currentStep === 'STEP_3' && this.routId != 0 && this.meterId != null) {
        this.displayCard('meter');
      }
      else if (this.currentStep === 'STEP_2' && this.meterId != null) {

      }
    }
  }
  applyFilter(filterValue: string): void {
    if (this.currentStep === 'STEP_1') {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    if (this.currentStep === 'STEP_2') {
      this.metersDataSource.filter = filterValue.trim().toLowerCase();
    }
  }
  cancelOrder(): void {
    this.location.back();
  }
  displayFlatsGrid(data): void {
    let request = new FlatRequest();
    request = {
      userId: this.user.id,
      propertyIds: [],
      flatIds: [],
      includeChildren: false,
    };
    request.propertyIds = [];
    request.propertyIds.push(this.browserService.getlocalStorage('currentPropertyId'));
    this.stockOverviewService.getFlatsByProperyty(request).subscribe(response => {
      this.dataSource = new MatTableDataSource();
      this.dataSource = new MatTableDataSource(response.data.items);
      this.stockOverviewService.flatData = response.data.items;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, err => console.log(err));
    this.currentStep = 'STEP_1';
    this.displayCard('property');
  }
  displayCard(type: string): void {
    if (type === 'user') {
      this.showHelloCard = true;
      this.showUserMap = true;
      this.showPropertyCard = false;
      this.showFlatCard = false;
      this.showMeterCard = false;
      this.showPropertySearch = false;
    }
    else if (type === 'property') {
      this.showPropertyCard = true;
      this.showFlatCard = false;
      this.showMeterCard = false;
      this.showUserMap = false;
      this.showHelloCard = false;
      this.showPropertySearch = true;
    }
    else if (type === 'flat') {
      this.showFlatCard = true;
      this.showPropertyCard = false;
      this.showMeterCard = false;
      this.showUserMap = false;
      this.showHelloCard = false;
      this.showPropertySearch = true;
    }
    else {
      this.showMeterCard = true;
      this.showPropertyCard = false;
      this.showFlatCard = false;
      this.showUserMap = false;
      this.showHelloCard = false;
      this.showPropertySearch = true;
    }
  }
  timeChange(newTimeE: string): void {
    this.toMin = this.utilityService.add30Minuts(newTimeE);
  }
  showFullMeter(meterType: string): string {
    return this.defaultDataService.DefaultData.lookUps.measuringInstrumentType.find(
      (mt) => mt.value === meterType
    )?.code;
  }
  downloadPDF(): void {
    this.downloadFile(FileName.commonPDF, FilePath.commonPDF);
    if (this.testLevel == 'meter') {
      const selectedMeter = this.stockOverviewService.meterData?.find(x => x.id == this.meterId);
      if (selectedMeter?.meterTypeDesc == MeterType.WMZ) {
        this.downloadFile(FileName.WMZPDF, FilePath.WMZPDF);
      }
      else if (selectedMeter?.meterTypeDesc == MeterType.HKV) {
        this.downloadFile(FileName.HKVPDF, FilePath.HKVPDF);
      }
      else if (selectedMeter?.meterTypeDesc == MeterType.WWZ || selectedMeter?.meterTypeDesc == MeterType.KWZ) {
        this.downloadFile(FileName.WWZORKWZ, FilePath.WWZORKWZ);
      }
    }
  }
  downloadFile(name, path): void {
    const link = document.createElement('a');
    link.download = name;
    link.href = path;
    link.click();
  }
  smsValueChange(event): void {
    if (this.orderId) {
      if (event.checked) {
        this.showTelephoneInput = true;
      }
      else { this.showTelephoneInput = false; }
    }
    else {
      if (event.checked) {
        this.showTelephoneInput = true;
      }
      else { this.showTelephoneInput = false; this.smokeDetectorRequest.phone = null; }
    }

  }
  emailValueChange(event): void {
    if (this.orderId) {
      if (event.checked) {
        this.showEmailInput = true;
      }
      else { this.showEmailInput = false; }
    }
    else {
      if (event.checked) {
        this.showEmailInput = true;
      }
      else { this.showEmailInput = false; this.smokeDetectorRequest.email = null; }
    }

  }
}
