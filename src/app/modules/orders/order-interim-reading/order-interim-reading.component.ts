import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {

  OrderFlatTableItem
} from '../models/orderFlatTableItem';

import {
  OrderFlatSummaryTableItem
} from '../models/orderFlatSummaryTableItem';

import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { OrdersService } from '../services/orders.service';
import { CommunicationMode, DateRange, ReadingRequest, TimeRange, UserMovingIn, UserMovingOut } from '../models/readingRequest';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { User } from 'src/app/shared/models/user.model';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { StockOverviewService } from '../../stock-overview/stock-overview.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { ResponseStatus } from 'src/app/shared/models/Response';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FlatRequest } from '../../stock-overview/models/flat-request.model';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { MatPaginator } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FileName, FilePath } from 'src/app/shared/Constant/PDF';
@Component({
  selector: 'app-order-interim-reading',
  templateUrl: './order-interim-reading.component.html',
  styleUrls: ['./order-interim-reading.component.scss']
})
export class OrderInterimReadingComponent implements OnInit, AfterViewInit {
  private routeSub: Subscription;
  flatIdnull: number;
  flatId: number;
  routeId: number;
  interimReadingFrom = '';
  user: User;
  propertyList: any[];
  propertySummary: OrderFlatSummaryTableItem;
  property: any;
  selectedFlat: any;
  isOverviewCardHidden = false;
  orderSummary: OrderFlatSummaryTableItem = new OrderFlatSummaryTableItem();
  @ViewChild(MatTable) table: MatTable<OrderFlatTableItem>;
  @ViewChild(MatTable) summaryTable: MatTable<OrderFlatSummaryTableItem>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('firstForm') firstForm;
  @ViewChild('alternativeForm') alternativeForm;
  floatLabelControl = new FormControl('auto');
  isVacant = true;
  btnDisabled = true;
  currentPropertyId = 0;
  summaryDataSource: MatTableDataSource<OrderFlatSummaryTableItem>;
  dataSource: MatTableDataSource<OrderFlatTableItem>;
  flatRequest: FlatRequest;
  freeText = '';
  currentStep = 'STEP_2';
  today: Date = new Date();
  showFlatCard = false;
  showMeterCard = false;
  showPropertyCard = false;
  showHelloCard = false;
  showUserMap = false;
  showPropertySearch = true;
  orderId: number = null;
  public toMin: any = '07:30 am';
  public readingRequest: ReadingRequest = new ReadingRequest();
  public userMovingIn: UserMovingIn = new UserMovingIn();
  public userMovingOut: UserMovingOut = new UserMovingOut();
  public preferredTimeRange: TimeRange = new TimeRange();
  public alternativeDateRange: DateRange = new DateRange();
  public communicationMode = new CommunicationMode();
  constructor(
    private ordersService: OrdersService,
    private browserService: BrowserStorageService,
    private authenticationService: AuthenticationService,
    private stockOverviewService: StockOverviewService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private utilityService: UtilityService,
    public defaultDataService: DefaultDataService,
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
    'tehaUserno',
    'adminUserno',
    'userName',
    'location',
    'actions'
  ];
  displayedSummaryColumns = [
    'tehauserno',
    'adminuserno',
    'userMovingOut',
    'moveOutDate',
    'appointmentDate',
    'address',
    'orderCreationDate'
  ];
  pageSize: number;
  ngOnInit(): void {
    this.orderId = history.state.orderId;
    this.currentStep = 'STEP_2';
    if (this.orderId) {
      this.ordersService.getEditInterimReading(this.orderId, history.state.propertyId).subscribe(res => {
        this.readingRequest = res.data;

        if (this.readingRequest.userMovingIn) {
          this.isVacant = true;
        }
        this.userMovingIn = JSON.parse(JSON.stringify(this.readingRequest.userMovingIn));
        this.userMovingOut = JSON.parse(JSON.stringify(this.readingRequest.userMovingOut));
        this.preferredTimeRange = JSON.parse(JSON.stringify(this.readingRequest.preferredTimeRange));
        this.alternativeDateRange = JSON.parse(JSON.stringify(this.readingRequest.alternativeDateRange));
        this.communicationMode = JSON.parse(JSON.stringify(this.readingRequest.communicationMode));

        if (res.data.flatId) {
          this.flatId = res.data.flatId;
          this.displayCard('flat');
          this.getSelectedFlatData(this.flatId);
        } else {
          this.displayCard('property');
        }
      }, (error) => {
        this.location.back();
        this.toastService.openSnackError(error.error.message);
      });
    } else {
      this.routeSub = this.route.params.subscribe(params => {
        this.flatId = Number(params['id']) || 0;
        this.routeId = this.flatId;
      });
      if (this.flatId != 0) {
        this.stockOverviewService.flatId = this.flatId;
        this.currentStep = 'STEP_2';
        this.displayCard('flat');
        this.getUserMovingOut(this.flatId);
        this.getSelectedFlatData(this.flatId);
      }
      this.currentPropertyId = this.browserService.getlocalStorage('currentPropertyId');
      if (this.flatId === 0) {
        this.currentStep = 'STEP_0';
        this.displayCard('user');
        this.routeId = 0;
        this.flatRequest.propertyIds.push(this.currentPropertyId);
        this.stockOverviewService.getFlatsByProperyty(this.flatRequest).subscribe(data => {
          this.dataSource = new MatTableDataSource(data.data.items);
          this.stockOverviewService.flatData = data.data.items;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, err => console.log(err));
      }
    }
  }
  getSelectedFlatData(flatId: number): void {
    this.stockOverviewService.getFlats(this.browserService.getlocalStorage('currentPropertyId'), flatId, false).subscribe(data => {
      this.selectedFlat = data.data.items[0];
    });
  }
  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }

  showOverviewCard(): void {
    this.isOverviewCardHidden = false;
  }

  hideOverviewCard(): void {
    this.isOverviewCardHidden = true;
  }

  stepper(nextStep: string): void {
    if (nextStep === 'STEP_1') {
      this.router.navigate(['/stockoverview/flat', this.currentPropertyId]);
      return;
    }
    if (nextStep === 'STEP_3') {
      if ((this.alternativeDateRange.from !== null && this.alternativeDateRange.to !== null) && this.alternativeDateRange.from > this.alternativeDateRange.to) {
        this.translate.get('order.alternativeDateErrorMsg').subscribe((value) => {
          this.toastService.openSnackError(value);
        });

        return;
      }
      if (this.userMovingOut.date != null && this.userMovingIn.date != null) {
        if (this.userMovingIn.date < this.userMovingOut.date) {
          this.translate.get('order.userValidationMsg').subscribe((value) => {
            this.toastService.openSnackError(value);
          });
          return;
        }
      }
    }
    this.currentStep = nextStep;
    this.propertyList = this.browserService.getSessionStorage('userProperties');
    this.property = this.propertyList.find(
      p => p.id === this.browserService.getlocalStorage('currentPropertyId'));
    // Prepare summary object
    this.orderSummary.userMovingOut = this.userMovingOut.firstName + ' ' + this.userMovingOut.lastName;
    this.orderSummary.moveOutDate = this.userMovingOut.date;
    this.orderSummary.appointmentDate = this.readingRequest.appointmentDate;
    this.orderSummary.tehauserno = this.selectedFlat.tehaUserNo;
    this.orderSummary.adminuserno = this.selectedFlat.adminUserNo;
    this.orderSummary.address = this.property?.street + ',' + this.property?.postcode + ',' + this.property?.place;
    this.orderSummary.orderCreationDate = new Date();
    const orderSummaryList = new Array<OrderFlatSummaryTableItem>();
    orderSummaryList.push(this.orderSummary);
    this.summaryDataSource = new MatTableDataSource(orderSummaryList);

    if (this.currentStep === 'STEP_4') {
      this.currentStep = 'STEP_3';
      this.userMovingOut.date = this.utilityService.setDateFormat(this.userMovingOut.date);
      this.userMovingIn.date = this.utilityService.setDateFormat(this.userMovingIn.date);
      this.alternativeDateRange.from = this.utilityService.setDateFormat(this.alternativeDateRange.from);
      this.alternativeDateRange.to = this.utilityService.setDateFormat(this.alternativeDateRange.to);
      this.readingRequest.appointmentDate = this.utilityService.setDateFormat(this.readingRequest.appointmentDate);
      this.readingRequest.userMovingOut = this.userMovingOut;
      this.readingRequest.userMovingIn = this.userMovingIn;
      this.readingRequest.preferredTimeRange = this.preferredTimeRange;
      this.readingRequest.alternativeDateRange = this.alternativeDateRange;
      this.readingRequest.communicationMode = this.communicationMode;
      this.readingRequest.propertyId = this.browserService.getlocalStorage('currentPropertyId');
      this.readingRequest.userId = this.user.id;
      if (!this.orderId) {
        this.readingRequest.flatId = this.flatId;
      }

      this.readingRequest.preferredTimeRange.from = this.utilityService.convertTime12to24(this.readingRequest.preferredTimeRange.from);
      this.readingRequest.preferredTimeRange.to = this.utilityService.convertTime12to24(this.readingRequest.preferredTimeRange.to);
      this.ordersService.RequestInterimReading(this.readingRequest).subscribe(res => {
        if (res.status == ResponseStatus.OK) {
          this.currentStep = 'STEP_4';
        }
        else {
          this.currentStep = 'STEP_3';
          this.toastService.openSnackError(res.message);
        }
      },

        (err) => {
          this.currentStep = 'STEP_3';
          this.toastService.openSnackError(err.message);
        }
      );
      this.btnDisabled = true;
    }
  }
  backToOrders(): void {
    this.router.navigate(['/orders/dashboard']);
  }
  showOptions(event): void {
    if (event.checked) {
      this.isVacant = true;
      this.alternativeForm.resetForm();
    }
    else {
      this.isVacant = false;
    }
  }
  goBack(): void {
    if (this.orderId) {
      this.router.navigate(['/orders']);
    }
    if (this.routeId != 0 && this.currentStep === 'STEP_2') {
      this.router.navigate(['/stockoverview/flat', this.browserService.getlocalStorage('currentPropertyId')]);
    }
    else if (this.routeId == 0 && this.currentStep == 'STEP_1') {
      this.currentStep = 'STEP_0';
      this.displayCard('user');
    }
    else {
      let step = parseInt(this.currentStep[5]);
      step = step - 1;
      this.currentStep = 'STEP_' + step.toString();
      if (this.currentStep === 'STEP_1') {
        this.displayCard('property');
      }
    }

  }
  placeOrder(id): void {
    this.stockOverviewService.flatId = id;
    this.selectedFlat = this.stockOverviewService.flatData.find(f => f.id === id);
    this.resetForm();
    this.currentStep = 'STEP_2';
    this.flatId = id;
    this.stockOverviewService.flatId = id;
    this.displayCard('flat');
    this.getUserMovingOut(id);
    this.isVacant = true;
  }
  propertyChange(id): void {
    this.browserService.setlocalStorage('currentPropertyId', id);
    this.currentStep = 'STEP_1';
    this.gotoFlats(true);
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  resetForm(): void {
    this.firstForm.resetForm();
  }
  cancelOrder(): void {
    this.location.back();
  }
  gotoFlats(event): void {
    this.dataSource = new MatTableDataSource();
    let request = new FlatRequest();
    request = {
      userId: this.user.id,
      propertyIds: [],
      flatIds: [],
      includeChildren: false,
    };
    request.propertyIds = [];
    request.propertyIds.push(this.browserService.getlocalStorage('currentPropertyId'));
    this.currentStep = 'STEP_1';
    this.displayCard('property');
    this.stockOverviewService.getFlatsByProperyty(request).subscribe(data => {
      this.dataSource.data = null;
      this.dataSource = new MatTableDataSource(data.data.items);
      this.stockOverviewService.flatData = data.data.items;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, err => console.log(err));
  }
  displayCard(type: string): void {
    if (type === 'user') {
      this.showHelloCard = true;
      this.showUserMap = true;
      this.showPropertyCard = false;
      this.showFlatCard = false;
      this.showPropertySearch = false;
    }
    else if (type === 'property') {
      this.showPropertyCard = true;
      this.showFlatCard = false;
      this.showUserMap = false;
      this.showHelloCard = false;
      this.showPropertySearch = true;
    }
    else if (type === 'flat') {
      this.showFlatCard = true;
      this.showPropertyCard = false;
      this.showUserMap = false;
      this.showHelloCard = false;
      this.showPropertySearch = true;
    }
    else {
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
  getUserMovingOut(flatId: number): void {
    this.ordersService.GetInterimReadingUserMovingOut(this.browserService.getlocalStorage('currentPropertyId'), flatId)
      .subscribe(
        (m) => {
          this.userMovingOut.salutationCode = m.data.salutationCode;
          this.userMovingOut.firstName = m.data.firstName;
          this.userMovingOut.lastName = m.data.lastName;
          this.userMovingOut.email = m.data.email;
          this.userMovingOut.phone = m.data.phone;
          this.userMovingOut.mobile = m.data.mobile;
        },
        () => {
          this.translate.get('order.prefillDataError').subscribe((value) => {
            this.toastService.openSnackInfo(value);
          });
        }
      );
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
