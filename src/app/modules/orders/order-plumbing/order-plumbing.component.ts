import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { StockOverviewService } from '../../stock-overview/stock-overview.service';
import { OrderPlumbingRequest } from '../models/order-plumbing-request.model';
import { OrdersService } from '../services/orders.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { Meter } from '../../stock-overview/models/meter.model';
import { OrderPlumbingFOrmComponent } from './order-plumbing-form/order-plumbing-form.component';
import { OrderPlumbingTableTwoComponent } from './order-plumbing-table-two/order-plumbing-table-two.component';
import { TranslateService } from '@ngx-translate/core';
export interface PeriodicElement {
  meterserialno: number;
  metertype: string;
  location: string;
  plumbingtype: string;
}

@Component({
  selector: 'app-order-plumbing',
  templateUrl: './order-plumbing.component.html',
  styleUrls: ['./order-plumbing.component.scss']
})
export class OrderPlumbingComponent implements OnInit, AfterViewInit {
  @ViewChild('altForm') formComponent: OrderPlumbingFOrmComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('meterCard') meterCard;
  @ViewChild('plumbingTable') propertyRef;
  @ViewChild('plumbingTableTwo') plumbingTableTwo: OrderPlumbingTableTwoComponent;
  displayedColumns: string[] = ['meterserialno', 'metertype', 'location', 'actions'];
  // dataSource = [];
  dataSource: MatTableDataSource<any>;
  meter: Meter = new Meter();
  orderPlumbingRequestNew = new OrderPlumbingRequest();
  orderPlumbingRequestCurrent = new OrderPlumbingRequest();
  currentStep = 'STEP_1';
  isOverviewCardHidden = false;
  meterId: number;
  routeSub: any;
  routId: number;
  pageSize = 10;
  allMetersIndicator = false;
  showMeterCard = false;
  showFlatCard = false;
  showPropertyCard = false;
  showHelloCard = false;
  showUserMap = false;
  showPropertySearch = true;
  orderId: number = null;
  redirectToStockOverviewFlats = false;
  plumbingLevel = '';
  orderAtFlatLevel = false;
  constructor(
    private orderService: OrdersService,
    private browserService: BrowserStorageService,
    private toastService: ToastService,
    private stockOverviewService: StockOverviewService,
    public defaultDataService: DefaultDataService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private utilityService: UtilityService,
    private translate: TranslateService) {
    this.pageSize = defaultDataService.DefaultData.systemSettings.gridPageSize;
  }

  ngOnInit(): void {
    this.plumbingLevel = this.browserService.getlocalStorage('plumbingLevel');
    if (this.plumbingLevel == 'MyOrderFloatFlat' || this.plumbingLevel == 'Flat') {
      this.orderAtFlatLevel = true;
    }
    else { this.orderAtFlatLevel = false; }
    this.orderId = history.state.orderId;
    this.currentStep = 'STEP_3';
    if (this.orderId) {
      this.orderService.getEditPlumbing(this.orderId, history.state.propertyId).subscribe(res => {
        if (res.data.meterIds[0]) {
          this.meterId = res.data.meterIds[0];
        }
        else { this.orderAtFlatLevel = true; }
        this.orderPlumbingRequestNew = res.data;
        this.orderPlumbingRequestCurrent = res.data;
        if (this.orderPlumbingRequestNew.alternativePerson.firstName != null || this.orderPlumbingRequestNew.alternativePerson.lastName != null) {
          this.formComponent.alternativeInd = true;
        }
        else {
          this.formComponent.alternativeInd = false;
        }
      }, (error) => {
        this.location.back();
        this.toastService.openSnackError(error.error.message);
      });
      this.stockOverviewService
        .getFlats(history.state.propertyId, history.state.flatId, true)
        .subscribe(res => {
          this.stockOverviewService.flatId = history.state.flatId;
          this.stockOverviewService.meterData = res.data.items[0].meters;
          this.stockOverviewService.flatData = res.data.items;
          this.meter = this.stockOverviewService.meterData?.find(m => m.id === this.meterId);
          if (this.orderAtFlatLevel) {
            this.displayCard('flat');
          }
          else { this.displayCard('meter'); }
        });
    } else {

      this.routeSub = this.route.params.subscribe(params => {
        this.routId = Number(params['id']) || 0;
      });
      if (this.routId != 0) {
        if (history.state.meterId == null) {
          this.currentStep = 'STEP_3';
          this.displayCard('flat');
          this.orderPlumbingRequestNew.flatId = this.stockOverviewService.flatId;
          this.orderPlumbingRequestNew.propertyId = this.browserService.getlocalStorage('currentPropertyId');
          this.redirectToStockOverviewFlats = true;
        }
        else {
          this.currentStep = 'STEP_3';
          this.meterId = this.routId;
          this.displayCard('meter');
          this.orderPlumbingRequestNew.meterIds.push(this.meterId);
          this.orderPlumbingRequestNew.flatId = this.stockOverviewService.flatId;
          this.orderPlumbingRequestNew.propertyId = this.browserService.getlocalStorage('currentPropertyId');
          this.meter = this.stockOverviewService.meterData?.find(m => m.id === this.meterId);
          this.redirectToStockOverviewFlats = false;
        }

      }
      else {
        this.currentStep = 'STEP_0';
        this.displayCard('user');
      }

      this.defaultDataService.DefaultData.lookUps.plumbingReason.forEach(element => {
        if (element.value.charAt(0) === '*') {
          element.value = element.value.substr(1);
        }
      });
      this.allMetersIndicator = this.stockOverviewService.allMetersIndicator =
        history.state.allMeters ? true : false;
      if (this.allMetersIndicator) {
        this.displayCard('property');
      }
    }
  }
  public ngAfterViewInit(): void {
  }
  showOverviewCard(): void {
    this.isOverviewCardHidden = false;
  }

  hideOverviewCard(): void {
    this.isOverviewCardHidden = true;
  }
  propertyChange(id): void {
    this.browserService.setlocalStorage('currentPropertyId', id);
    this.formComponent.firstForm.resetForm();
    this.orderPlumbingRequestNew = new OrderPlumbingRequest();
    this.gotoFlats(true);
  }
  showFullMeter(meterType: string): string {
    return this.defaultDataService.DefaultData.lookUps.measuringInstrumentType.find(
      (mt) => mt.value === meterType
    )?.code;
  }
  stepper(nextStep: string): void {
    if (nextStep === 'STEP_4') {
      this.plumbingTableTwo.ngOnInit();
      if (this.orderAtFlatLevel) {
        this.meter = this.stockOverviewService.flatData?.find(m => m.id === this.stockOverviewService.flatId);
      }
      if ((this.orderPlumbingRequestNew.alternativeDateRange.from !== null && this.orderPlumbingRequestNew.alternativeDateRange.to !== null)
        && this.orderPlumbingRequestNew.alternativeDateRange.from > this.orderPlumbingRequestNew.alternativeDateRange.to) {
        this.translate.get('order.alternativeDateErrorMsg').subscribe((value) => {
          this.toastService.openSnackError(value);
        });
        return;
      }
    }
    this.currentStep = nextStep;
  }
  backToOrders(): void {
    this.router.navigate(['/orders/dashboard']);
  }
  handleStep1Click($ev): void {
    if ($ev) {
      this.orderPlumbingRequestNew.propertyId = this.browserService.getlocalStorage('currentPropertyId');
      this.orderPlumbingRequestNew.flatId = $ev;
      this.stockOverviewService.flatId = $ev;
      const plumbingLevel = this.browserService.getlocalStorage('plumbingLevel');
      if (plumbingLevel == 'MyOrderFloatFlat') {
        this.stepper('STEP_3');
        this.displayCard('flat');
        this.formComponent.firstForm.resetForm();
      }
      else {
        this.currentStep = 'STEP_2';
        this.displayCard('flat');
        const metersTypes = this.defaultDataService.DefaultData.lookUps.measuringInstrumentType;
        const allLocaions = this.defaultDataService.DefaultData.lookUps.location;
        this.stockOverviewService.getFlats(this.browserService.getlocalStorage('currentPropertyId'), $ev, true).subscribe(m => {
          this.stockOverviewService.meterData = JSON.parse(JSON.stringify(m.data.items[0].meters));
          this.dataSource = new MatTableDataSource();
          this.dataSource = new MatTableDataSource(m.data.items[0].meters);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource?.data.forEach(element => {
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




    }
  }
  goToOrderForm(meterId: number): void {
    this.stepper('STEP_3');
    this.meterId = meterId;
    this.displayCard('meter');
    this.formComponent.firstForm.resetForm();
    this.orderPlumbingRequestNew.meterIds.push(meterId);
    this.meterCard?.updateCard(this.meterId);
    this.meter = this.stockOverviewService.meterData?.find(m => m.id === this.meterId);

  }
  sendOrderRequest(): void {
    this.orderPlumbingRequestNew.appointmentDate = this.utilityService.setDateFormat(this.orderPlumbingRequestNew.appointmentDate);
    this.orderPlumbingRequestNew.alternativeDateRange.from = this.utilityService.setDateFormat(this.orderPlumbingRequestNew.alternativeDateRange.from);
    this.orderPlumbingRequestNew.alternativeDateRange.to = this.utilityService.setDateFormat(this.orderPlumbingRequestNew.alternativeDateRange.to);
    this.orderPlumbingRequestNew.preferredTimeRange.from = this.utilityService.convertTime12to24(this.orderPlumbingRequestNew.preferredTimeRange.from);
    this.orderPlumbingRequestNew.preferredTimeRange.to = this.utilityService.convertTime12to24(this.orderPlumbingRequestNew.preferredTimeRange.to);
    this.stepper('STEP_4');
    this.orderService.orderPlumbing(this.orderPlumbingRequestNew).subscribe(m => {
      this.stepper('STEP_5');
    },
      (err) => {
        console.log('PLumbing request error', err);
        this.translate.get('order.submitFailMsg').subscribe((value) => {
          this.toastService.openSnackInfo(value);
        });
      });
  }
  filterGrid(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  goBack(): void {
    if (this.orderId && this.currentStep === 'STEP_3') {
      this.router.navigate(['/orders']);
    }
    else if (this.currentStep === 'STEP_1' && this.routId == 0) {
      this.currentStep = 'STEP_0';
      this.displayCard('user');
    }
    else if (this.currentStep === 'STEP_3' && this.redirectToStockOverviewFlats == true) {
      this.router.navigate(['/stockoverview/flat', this.browserService.getlocalStorage('currentPropertyId')]);
    }
    else if (this.currentStep === 'STEP_3' && this.plumbingLevel == 'MyOrderFloatFlat') {
      this.currentStep = 'STEP_1';
    }
    else if (this.currentStep === 'STEP_3' && this.routId != 0 && this.browserService.getlocalStorage('currentFlatId') == null) {
      this.router.navigate(['/stockoverview/allmeters'], { state: { allMeters: true } });
    }
    else if (this.currentStep === 'STEP_3' && this.routId != 0) {
      this.router.navigate(['/stockoverview/meters', this.browserService.getlocalStorage('currentFlatId')]);
    }
    else if (this.currentStep === 'STEP_1') {
      this.location.back();
    }
    else {
      let step = parseInt(this.currentStep[5]);
      step = step - 1;
      this.currentStep = 'STEP_' + step.toString();
      if (this.allMetersIndicator) {
        this.displayCard('property');
      }
      else if (this.currentStep === 'STEP_1') {
        this.displayCard('property');
      }
      else if (this.currentStep === 'STEP_2') {
        this.displayCard('flat');
      }
      else if (this.orderAtFlatLevel) {
        this.displayCard('flat');
      }
      else {
        this.displayCard('meter');
      }
    }
  }
  cancelOrder(): void {
    this.location.back();
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
  gotoFlats(event): void {
    this.currentStep = 'STEP_1';
    this.displayCard('property');
    this.propertyRef.ngOnInit();
  }
}
