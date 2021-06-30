import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { LookUps } from 'src/app/shared/models/Lookup';
import { ResponseStatus } from 'src/app/shared/models/Response';
import { User } from 'src/app/shared/models/user.model';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { Meter } from '../../stock-overview/models/meter.model';
import { StockOverviewService } from '../../stock-overview/stock-overview.service';
import { AlternativePerson } from '../models/order-plumbing-request.model';
import { CommunicationMode, DateRange, TimeRange } from '../models/readingRequest';
import { ContactPerson } from '../models/smokeDetectorRequest';
import { OrdersService } from '../services/orders.service';
import { OrderReadingSummaryTableItem } from '../models/orderReadingSummaryTableItem';
import { OrderReadingRequest } from '../models/orderReadingRequest';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { OrderFlatTableItem } from '../models/orderFlatTableItem';
import { FlatRequest } from '../../stock-overview/models/flat-request.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Location } from '@angular/common';
import { OrderMeterTableItem } from '../models/orderMeterTableItem';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { FilePath, FileName, MeterType } from '../../../shared/Constant/PDF';
@Component({
  selector: 'app-order-reading',
  templateUrl: './order-reading.component.html',
  styleUrls: ['./order-reading.component.scss']
})
export class OrderReadingComponent implements OnInit, AfterViewInit {
  user: User;
  meterIds: number[] = [];
  propertyList: any[];
  property: any;
  reason: any;
  plumbingReason: LookUps[] = [];
  isOverviewCardHidden = false;

  public orderReadingRequest: OrderReadingRequest = new OrderReadingRequest();
  public preferredTimeRange: TimeRange = new TimeRange();
  public alternativeDateRange: DateRange = new DateRange();
  public communicationMode = new CommunicationMode();
  public alternativePerson = new ContactPerson();
  summaryDataSource: MatTableDataSource<OrderReadingSummaryTableItem>;
  dataSource: MatTableDataSource<OrderFlatTableItem>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('firstFrom') firstFrom;
  orderSummary: OrderReadingSummaryTableItem = new OrderReadingSummaryTableItem();
  metersDataSource: MatTableDataSource<OrderMeterTableItem>;
  floatLabelControl = new FormControl('auto');
  isVacant = false;
  disableInput = false;
  currentStep = 'STEP_2';
  btnDisabled = true;
  meterId: number;
  currentFlatId: number;
  currentMeter: Meter;
  readingLevel = '';
  flatRequest: FlatRequest;
  flatId: number;
  propertyId: number;
  orderId: number;
  routeId: number;
  pageSize: number;
  orderLevel = false;
  today: Date = new Date();
  allMetersIndicator = false;
  showMeterCard = false;
  showFlatCard = false;
  showPropertyCard = false;
  showHelloCard = false;
  showUserMap = false;
  showPropertySearch = true;
  @ViewChild('meterCard') meterCard;
  showAlternativeUser = true;
  public toMin: any = '07:30 am';
  public orderSummaryLevel = '';
  displayedSummaryColumns = [];
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
  displayedColumns = [
    'tehaUserNo',
    'adminUserNo',
    'tenantName',
    'location',
    'actions'
  ];
  displayedMetersColumns = [
    'serialNumber',
    'meterTypeDesc',
    'location',
    'actions'
  ];
  routeSub: any;
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
    private translate: TranslateService,
  ) {

    this.authenticationService.currentUser.subscribe((u) => {
      if (u != null) {
        this.user = u;
        this.flatRequest.userId = this.user.id;
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
    this.currentStep = 'STEP_2';
    if (this.orderId) {
      this.ordersService.getEditReading(this.orderId, history.state.propertyId).subscribe(res => {
        this.orderReadingRequest = res.data;
        this.browserService.setlocalStorage('currentPropertyId', this.orderReadingRequest.propertyId);
        this.propertyId = history.state.propertyId;
        if (this.orderReadingRequest.alternativePerson) {
          this.isVacant = true;
          this.disableInput = true;
        }
        this.alternativePerson = JSON.parse(JSON.stringify(this.orderReadingRequest.alternativePerson));
        this.preferredTimeRange = JSON.parse(JSON.stringify(this.orderReadingRequest.preferredTimeRange));
        this.alternativeDateRange = JSON.parse(JSON.stringify(this.orderReadingRequest.alternativeDateRange));
        this.communicationMode = JSON.parse(JSON.stringify(this.orderReadingRequest.communicationMode));
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
          this.stockOverviewService.flatId = res.data.flatId;
          this.propertyId = res.data.propertyId;
          this.orderSummaryLevel = 'meter';
          this.setSummaryColumns();
          this.getFlatsMeters(this.orderReadingRequest.propertyId, this.orderReadingRequest.flatId);
          this.meterCard?.updateCard(this.meterId);
        } else if (res.data.flatId) {
          this.flatId = res.data.flatId;
          this.propertyId = res.data.propertyId;
          this.orderSummaryLevel = 'flat';
          this.setSummaryColumns();
          this.getFlatsMeters(this.orderReadingRequest.propertyId, this.orderReadingRequest.flatId);
        } else {
          this.showAlternativeUser = false;
          this.propertyId = res.data.propertyId;
          this.browserService.setlocalStorage('currentPropertyId', this.propertyId);
          this.orderSummaryLevel = 'property';
          this.displayCard('property');
          this.setSummaryColumns();
        }

      }, (error) => {
        this.location.back();
        this.toastService.openSnackError(error.error.message);
      });
      this.getFlatsMeters(history.state.propertyId, history.state.flatId);


    } else {
      this.readingLevel = this.browserService.getlocalStorage('readingLevel');
      this.routeSub = this.route.params.subscribe(params => {
        this.routeId = Number(params['id']) || 0;
      });
      if (this.readingLevel === 'Property') {
        this.propertyId = this.routeId;
        this.flatId = null;
        this.displayCard('property');
        this.showAlternativeUser = false;
        this.orderSummaryLevel = 'property';
      }
      else if (this.readingLevel === 'Flat') {
        this.flatId = this.routeId;
        this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
        this.displayCard('flat');
        this.stockOverviewService.flatId = this.routeId;
        this.orderSummaryLevel = 'flat';
      }
      else if (this.readingLevel === 'Meter') {
        this.meterId = this.routeId;
        this.flatId = this.browserService.getlocalStorage('currentFlatId');
        this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
        this.getFlatMeters(this.browserService.getlocalStorage('currentPropertyId'), this.flatId, true);
        this.displayCard('meter');
        this.orderSummaryLevel = 'meter';
      }
      else if (this.readingLevel === 'floatingOrMyordrsProperty') {
        this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
        this.currentStep = 'STEP_0';
        this.displayCard('user');
        this.showAlternativeUser = false;
        this.orderSummaryLevel = 'property';
      }
      else if (this.readingLevel === 'floatingOrMyordrsFlat') {
        this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
        this.orderLevel = true;
        this.currentStep = 'STEP_0';
        this.displayCard('user');
        this.orderSummaryLevel = 'flat';
      }
      else if (this.readingLevel === 'floatingOrMyordrsMeter') {
        this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
        this.currentStep = 'STEP_0';
        this.orderLevel = false;
        this.displayCard('user');
        this.orderSummaryLevel = 'meter';
      }
      else {
        this.routeId = 0;
        this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
      }
      if (this.routeId != 0) {
        this.currentStep = 'STEP_2';
      }
      if (this.routeId === 0) {
        this.currentStep = 'STEP_0';
        this.flatRequest.propertyIds.push(this.browserService.getlocalStorage('currentPropertyId'));
        this.stockOverviewService.getFlatsByProperyty(this.flatRequest).subscribe(data => {
          this.stockOverviewService.flatData = data.data.items;
          this.dataSource = new MatTableDataSource(data.data.items);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }, err => console.log(err));
      }
      this.currentFlatId = this.browserService.getlocalStorage('currentFlatId');
      this.stockOverviewService.getFlats(this.browserService.getlocalStorage('currentPropertyId'), this.currentFlatId, false).subscribe(data => {
        this.selectedFlat = data.data.items[0];

      });
      this.currentMeter = this.stockOverviewService.meterData?.find(m => m.id === this.meterId);
      this.defaultDataService.DefaultData.lookUps.plumbingReason.forEach(element => {
        if (element.value.charAt(0) === '*') {
          element.value = element.value.substr(1);
          this.plumbingReason.push(element);
        }

      });
    }
    this.setSummaryColumns();
  }
  setSummaryColumns(): void {
    if (this.orderSummaryLevel == 'property') {
      this.displayedSummaryColumns = [
        'tehaLgNo',
        'adminLgNo',
        'appointmentDate',
        'address',
        'orderCreationDate',
      ];
    }
    else if (this.orderSummaryLevel == 'flat') {
      this.displayedSummaryColumns = [
        'tehaUserNo',
        'adminUserNo',
        'appointmentDate',
        'address',
        'orderCreationDate',
      ];
    }
    else if (this.orderSummaryLevel == 'meter') {
      this.displayedSummaryColumns = [
        'serialNumber',
        'meterTypeDesc',
        'location',
        'appointmentDate',
        'address',
        'orderCreationDate',
      ];
    }
  }

  ngAfterViewInit(): void {
    this.meterCard?.updateCard(this.meterId);
  }
  getFlatsMeters(propertyId, flatId): void {
    this.stockOverviewService
      .getFlats(propertyId, flatId, true)
      .subscribe(res => {
        this.stockOverviewService.flatId = flatId;
        this.stockOverviewService.meterData = res.data.items[0].meters;
        this.stockOverviewService.flatData = res.data.items;
        if (this.orderSummaryLevel == 'meter') {
          this.displayCard('meter');
          this.meterCard?.updateCard(this.meterId);
        }
        else if (this.orderSummaryLevel == 'flat') {
          this.displayCard('flat');
        }
        else {
          this.displayCard('property');
        }
      });
  }

  showOverviewCard(): void {
    this.isOverviewCardHidden = false;
  }

  hideOverviewCard(): void {
    this.isOverviewCardHidden = true;
  }

  stepper(nextStep: string): void {
    if (nextStep === 'STEP_3') {
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
    if (this.currentStep === 'STEP_3') {
      this.setOrderSummary();
    }


    if (this.currentStep === 'STEP_4') {
      this.currentStep = 'STEP_3';
      this.alternativeDateRange.from = this.utilityService.setDateFormat(this.alternativeDateRange.from);
      this.alternativeDateRange.to = this.utilityService.setDateFormat(this.alternativeDateRange.to);
      this.orderReadingRequest.appointmentDate = this.utilityService.setDateFormat(this.orderReadingRequest.appointmentDate);
      this.orderReadingRequest.alternativePerson = this.alternativePerson;
      this.orderReadingRequest.preferredTimeRange = this.preferredTimeRange;
      this.orderReadingRequest.alternativeDateRange = this.alternativeDateRange;
      this.orderReadingRequest.communicationMode = this.communicationMode;
      this.orderReadingRequest.userId = this.user.id;
      if (!this.orderId) {
        this.orderReadingRequest.propertyId = this.propertyId;
        this.orderReadingRequest.flatId = this.flatId;
        this.orderReadingRequest.meterId = this.meterId;
      }
      this.orderReadingRequest.preferredTimeRange.from = this.utilityService.convertTime12to24(this.orderReadingRequest.preferredTimeRange.from);
      this.orderReadingRequest.preferredTimeRange.to = this.utilityService.convertTime12to24(this.orderReadingRequest.preferredTimeRange.to);

      if (!this.isVacant) {
        const defaultContactPerson: ContactPerson = new ContactPerson();

        this.orderReadingRequest.alternativePerson = defaultContactPerson;
      }
      this.ordersService.RequestReading(this.orderReadingRequest).subscribe(res => {
        this.btnDisabled = true;
        if (res.status == ResponseStatus.OK) {
          this.currentStep = 'STEP_4';
        }
        else {
          this.btnDisabled = false;
          this.currentStep = 'STEP_3';
          this.toastService.openSnackError(res.message);
        }
      },

        (err) => {
          this.btnDisabled = false;
          this.currentStep = 'STEP_3';
          console.log('api error response', err);
          this.toastService.openSnackError(err.message);
        }

      );
    }
  }
  backToOrders(): void {
    this.orderReadingRequest = new OrderReadingRequest();
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
  placeOrder(id): void {
    this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
    this.stockOverviewService.flatId = id;
    this.selectedFlat = this.stockOverviewService.flatData.find(f => f.id === id);
    this.resetForm();
    this.flatId = id;
    this.currentStep = 'STEP_2';
    this.displayCard('flat');
  }
  propertyChange(id): void {
    this.propertyId = id;
    this.browserService.setlocalStorage('currentPropertyId', id);
    if (this.routeId != 0 && this.readingLevel == 'Property') {
      this.resetForm();
      this.orderReadingRequest = new OrderReadingRequest();
      this.currentStep = 'STEP_2';
    }
    else if (this.routeId != 0 && this.readingLevel == 'Flat') {
      this.resetForm();
      this.orderReadingRequest = new OrderReadingRequest();
      this.currentStep = 'STEP_1';
      this.displayCard('property');
      this.orderLevel = true;
      this.getFlats();
    }
    else if (this.routeId != 0 && this.readingLevel == 'Meter') {
      this.resetForm();
      this.orderReadingRequest = new OrderReadingRequest();
      this.currentStep = 'STEP_1';
      this.displayCard('property');
      this.orderLevel = false;
      this.getFlats();
    }
    else if (this.routeId == 0 && this.readingLevel == 'floatingOrMyordrsProperty') {
      this.resetForm();
      this.orderReadingRequest = new OrderReadingRequest();
      this.currentStep = 'STEP_2';
    }
    else if (this.routeId == 0 && this.readingLevel == 'floatingOrMyordrsFlat') {
      this.resetForm();
      this.orderReadingRequest = new OrderReadingRequest();
      this.currentStep = 'STEP_1';
      this.displayCard('property');
      this.orderLevel = true;
      this.getFlats();
    }
    else if (this.routeId == 0 && this.readingLevel == 'floatingOrMyordrsMeter') {
      this.resetForm();
      this.orderReadingRequest = new OrderReadingRequest();
      this.currentStep = 'STEP_1';
      this.displayCard('property');
      this.orderLevel = false;
      this.getFlats();
    }
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilterOnMeterGrid(filterValue: string): void {
    this.metersDataSource.filter = filterValue.trim().toLowerCase();
  }
  goBack(): void {
    if (history.state.orderId && this.currentStep === 'STEP_2') {
      this.location.back();
    }
    if (this.readingLevel === 'Property' && this.currentStep === 'STEP_2' && this.routeId != 0) {
      this.router.navigate(['/stockoverview/dashboard']);
    }
    else if (this.readingLevel === 'Flat' && this.currentStep === 'STEP_2') {
      this.router.navigate(['/stockoverview/flat', this.browserService.getlocalStorage('currentPropertyId')]);
    }
    else if (this.readingLevel === 'Meter' && this.currentStep === 'STEP_2' && this.browserService.getlocalStorage('currentFlatId') == null) {
      this.router.navigate(['/stockoverview/allmeters'], { state: { allMeters: true } });
    }
    else if (this.readingLevel === 'Meter' && this.currentStep === 'STEP_2') {
      this.router.navigate(['/stockoverview/meters', this.browserService.getlocalStorage('currentFlatId')]);
    }
    else if (this.readingLevel === 'floatingOrMyordrsProperty' && this.currentStep === 'STEP_2') {
      this.currentStep = 'STEP_0';
      this.displayCard('user');
    } else if (this.readingLevel === 'floatingOrMyordrsFlat' && this.currentStep === 'STEP_1') {
      this.currentStep = 'STEP_0';
      this.displayCard('user');
    }
    else if (this.readingLevel === 'floatingOrMyordrsMeter' && this.currentStep === 'STEP_2') {
      this.currentStep = 'STEP_5';
      this.displayCard('flat');
    }
    else if (this.currentStep === 'STEP_5') {
      this.currentStep = 'STEP_1';
      this.displayCard('property');
    }
    else {
      let step = parseInt(this.currentStep[5]);
      step = step - 1;
      this.currentStep = 'STEP_' + step.toString();
      if (this.currentStep === 'STEP_0') {
        this.displayCard('user');
      }
      else if (this.currentStep === 'STEP_1') {
        this.displayCard('property');
      }
      else if (this.currentStep === 'STEP_5') {
        this.displayCard('meter');
      }
    }
  }
  cancelOrder(): void {
    this.location.back();
  }
  handleStep1Click(id): void {
    this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
    this.displayCard('flat');
    this.currentStep = 'STEP_5';
    if (id) {
      this.getFlatMeters(this.browserService.getlocalStorage('currentPropertyId'), id, true);
      this.flatId = id;
      this.stockOverviewService.flatId = id;
    }
  }
  getFlatMeters(propertyId, flatId, includeChildInd): void {
    let metersTypes = this.defaultDataService.DefaultData.lookUps.measuringInstrumentType;
    let allLocaions = this.defaultDataService.DefaultData.lookUps.location;

    this.stockOverviewService.getFlats(propertyId, flatId, includeChildInd).subscribe(m => {
      this.metersDataSource = new MatTableDataSource(m.data.items[0].meters);
      this.metersDataSource.sort = this.sort;
      this.metersDataSource.paginator = this.paginator;
      this.stockOverviewService.meterData = JSON.parse(JSON.stringify(m.data.items[0].meters));
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
  }
  resetForm(): void {
    this.firstFrom.resetForm();
  }
  placeOrderMeterLevel(id): void {
    this.resetForm();
    this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
    this.meterId = id;
    this.currentStep = 'STEP_2';
    this.meterCard?.updateCard(this.meterId);
    this.displayCard('meter');
  }
  showFullMeter(meterType: string): string {
    return this.defaultDataService.DefaultData.lookUps.measuringInstrumentType.find(
      (mt) => mt.value === meterType
    )?.code;
  }
  showFullLocation(location: string): string {
    return this.defaultDataService.DefaultData.lookUps.location.find(
      (mt) => mt.code === location
    )?.value;
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
  handleClickEvent(event): void {
    if (event.type) {
      this.propertyId = event.id;
      this.currentStep = 'STEP_2';
      this.displayCard('property');
    }
    else {
      this.currentStep = 'STEP_1';
      this.displayCard('property');
      this.getFlats();
    }

  }
  getFlats(): void {
    this.dataSource = new MatTableDataSource();
    let request = new FlatRequest();
    request = {
      userId: this.user.id,
      propertyIds: [],
      flatIds: [],
      includeChildren: false,
    };
    request.propertyIds.push(this.browserService.getlocalStorage('currentPropertyId'));
    this.stockOverviewService.getFlatsByProperyty(request).subscribe(data => {
      this.dataSource.data = null;
      this.stockOverviewService.flatData = data.data.items;
      this.dataSource = new MatTableDataSource(data.data.items);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, err => console.log(err));
  }
  timeChange(newTimeE: string): void {
    this.toMin = this.utilityService.add30Minuts(newTimeE);
  }
  setOrderSummary(): void {
    this.currentStep = this.currentStep;

    this.propertyList = this.browserService.getSessionStorage('userProperties');
    let orderForProperty = this.propertyList.find(
      p => p.id === this.browserService.getlocalStorage('currentPropertyId'));
    if (this.orderSummaryLevel === 'property') {
      this.orderSummary = new OrderReadingSummaryTableItem();
      this.orderSummary.adminLgNo = orderForProperty.adminLgNo;
      this.orderSummary.tehaLgNo = orderForProperty.tehaLgNo;
      this.orderSummary.appointmentDate = this.orderReadingRequest.appointmentDate;
      this.orderSummary.address = orderForProperty.street + ',' + orderForProperty.postcode + ',' + orderForProperty.place;
      this.orderSummary.orderCreationDate = new Date();
      let orderSummaryobject = new Array<OrderReadingSummaryTableItem>();
      orderSummaryobject.push(this.orderSummary);
      this.summaryDataSource = new MatTableDataSource(orderSummaryobject);
      this.currentStep = 'STEP_3';
    }
    else if (this.orderSummaryLevel === 'flat') {
      let orderForFlat = this.stockOverviewService.flatData.find(x => x.id == this.flatId);
      this.orderSummary = new OrderReadingSummaryTableItem();
      this.orderSummary.adminUserNo = orderForFlat.adminUserNo;
      this.orderSummary.tehaUserNo = orderForFlat.tehaUserNo;
      this.orderSummary.appointmentDate = this.orderReadingRequest.appointmentDate;
      this.orderSummary.address = orderForProperty.street + ',' + orderForProperty.postcode + ',' + orderForProperty.place;
      this.orderSummary.orderCreationDate = new Date();
      let orderSummaryobject = new Array<OrderReadingSummaryTableItem>();
      orderSummaryobject.push(this.orderSummary);
      this.summaryDataSource = new MatTableDataSource(orderSummaryobject);
    }
    else if (this.orderSummaryLevel === 'meter') {

      let orderForMeter = this.stockOverviewService.meterData?.find(x => x.id == this.meterId);
      this.orderSummary = new OrderReadingSummaryTableItem();
      this.orderSummary.serialNumber = orderForMeter?.serialNumber;
      this.orderSummary.meterTypeDesc = orderForMeter?.meterTypeDesc;
      this.orderSummary.location = orderForMeter?.location;
      this.orderSummary.appointmentDate = this.orderReadingRequest.appointmentDate;
      this.orderSummary.address = orderForProperty.street + ',' + orderForProperty.postcode + ',' + orderForProperty.place;
      this.orderSummary.orderCreationDate = new Date();
      let orderSummaryobject = new Array<OrderReadingSummaryTableItem>();
      orderSummaryobject.push(this.orderSummary);
      this.summaryDataSource = new MatTableDataSource(orderSummaryobject);
    }
  }
  downloadPDF(): void {
    this.downloadFile(FileName.commonPDF, FilePath.commonPDF);
    if (this.orderSummaryLevel == 'meter') {
      let selectedMeter = this.stockOverviewService.meterData?.find(x => x.id == this.meterId);
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
      else { this.showTelephoneInput = false; this.orderReadingRequest.phone = null; }
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
      else { this.showEmailInput = false; this.orderReadingRequest.email = null; }
    }

  }
}
