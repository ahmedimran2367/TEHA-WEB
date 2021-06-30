import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { OrdersService } from '../services/orders.service';
import { WaterSamplingRequest, Questions, DrinkingWaterExtractionPoint } from '../models/waterSamplingRequest';
import { OderWaterAnalysisNewBuildingComponent } from './components/oder-water-analysis-new-building/oder-water-analysis-new-building.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
@Component({
  selector: 'app-order-water-analysis',
  templateUrl: './order-water-analysis.component.html',
  styleUrls: ['./order-water-analysis.component.scss']
})
export class OrderWaterAnalysisComponent implements OnInit, AfterViewInit {
  currentStep = 'STEP_1';
  showSummary = false;
  drinkingWaterInd: boolean;
  showPropertyGrid = false;
  showPropertyCard = false;
  showHelloCard = false;
  showUserMap = false;
  showMeterCard = false;
  showFlatCard = false;
  showPropertySearch = true;
  @ViewChild('abcc') childComp: OderWaterAnalysisNewBuildingComponent;
  propertyId: number;
  routeId: number;
  constructor(public ordersService: OrdersService, private router: Router, private route: ActivatedRoute, private browserService: BrowserStorageService) {

    this.ordersService.waterSamplingRequest = new WaterSamplingRequest();
    this.ordersService.waterSamplingRequest.questions = new Questions();
    this.ordersService.waterSamplingRequest.questions.drinkingWaterExtractionPoint = new Array<DrinkingWaterExtractionPoint>();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {

      this.propertyId = parseInt(paramMap.get('id'));
      this.routeId = parseInt(paramMap.get('id')) || 0;
      if (Number.isNaN(this.propertyId)) {
        this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
        this.displayCard('user');
        this.showPropertyGrid = true;
      }
      else {
        this.browserService.setlocalStorage('currentPropertyId', this.propertyId);
        this.displayCard('property');
        this.showPropertyGrid = false;
      }
    });


    const properties = this.browserService.getSessionStorage('userProperties');
    const property = properties?.find(
      (p) => p.id === this.browserService.getlocalStorage('currentPropertyId')
    );
    if (property) {
      if (property.drinkingWaterInd) {
        this.showSummary = true;
        this.drinkingWaterInd = true;
      }
      else {
        this.showSummary = false;
        this.drinkingWaterInd = false;
      }
    }
  }

  ngAfterViewInit(): void {
    // this.childComp.enableScreen2();
  }

  backToOrders(): void {
    this.currentStep = 'STEP_1';
  }

  TestButton(): void {
    this.currentStep = 'STEP_2';
  }

  stepper(nextStep: string): void {
    this.currentStep = nextStep;
  }
  hideSummary(hideInd): void {
    if (hideInd) {
      this.showSummary = false;
      this.childComp.enableScreen2();
    }
    else {
      this.showSummary = true;
    }
  }
  propertyChange(id): void {
    this.browserService.setlocalStorage('currentPropertyId', id);

    // this.summarychildComp.ngAfterViewInit();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {

      if (this.routeId == 0) {
        this.router.navigate(['/orders/wateranalysis']);
      }
      else {
        this.router.navigate(['/orders/wateranalysis', id]);
      }
    });
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
  createNewOrder(event): void {
    this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
    this.displayCard('property');
    this.showPropertyGrid = false;
  }
  goBackList(event): void {
this.showPropertyGrid = true;
  }
}
