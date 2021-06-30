import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockOverviewService } from 'src/app/modules/stock-overview/stock-overview.service';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { OrdersService } from '../../../services/orders.service';
import { DrinkingWaterExtractionPoint } from '../../../models/waterSamplingRequest';
import { Location } from '@angular/common';
@Component({
  selector: 'app-oder-water-analysis-new-building',
  templateUrl: './oder-water-analysis-new-building.component.html',
  styleUrls: ['./oder-water-analysis-new-building.component.scss']
})
export class OderWaterAnalysisNewBuildingComponent implements OnInit {
  @Output('hideSummary') hideSummary: EventEmitter<any> = new EventEmitter<boolean>();
  scrValue = false;
  arr = Array;
  rowIndex = 0;
  propertyId: number;
  redirectToProperty: boolean;
  @Output() goBackEvent = new EventEmitter();
  constructor(
    public orderService: OrdersService,
    private router: Router,
    public defaultDataService: DefaultDataService,
    private route: ActivatedRoute,
    private browserService: BrowserStorageService,
    private stockOverviewService: StockOverviewService,
    private location: Location) {
    this.orderService.waterSamplingRequest.questions.drinkingWaterExtractionPoint.push(new DrinkingWaterExtractionPoint());
  }
  addExtractionpointsObj(): void {
    this.rowIndex = this.rowIndex + 1;
    this.orderService.waterSamplingRequest.questions.drinkingWaterExtractionPoint.push(new DrinkingWaterExtractionPoint());
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {

      this.propertyId = parseInt(paramMap.get('id'));
    });
    if (!this.propertyId) {
      this.redirectToProperty = true;
      this.propertyId = this.browserService.getlocalStorage('currentPropertyId');
    }
    if (this.stockOverviewService.flatData == undefined || (this.stockOverviewService.flatData != undefined && this.stockOverviewService.flatData.length == 0)) {
      this.stockOverviewService
        .getFlats(this.propertyId, null, false)
        .subscribe((m) => {
          this.stockOverviewService.flatData = m.data.items;
        });
    }
  }

  onChangeInspection(event): void {
    this.orderService.waterSamplingRequest.questions.storageVolume400 = false;
    this.orderService.waterSamplingRequest.questions.lineContent3L = false;
    event.value.forEach(element => {
      if (element == 'S') {
        this.orderService.waterSamplingRequest.questions.storageVolume400 = true;
      }
      else {
        this.orderService.waterSamplingRequest.questions.lineContent3L = true;
      }
    });
  }

  confirm(): void {
    this.hideSummary.emit(false);
  }
  remove(index): void {
    this.orderService.waterSamplingRequest.questions.drinkingWaterExtractionPoint.splice(index, 1);
    this.rowIndex = this.rowIndex - 1;
  }
  enableScreen2(): void {
    this.scrValue = true;
  }
  changeInspectionInAdvance(data): void {
    if (data.value == '0') {
      this.orderService.waterSamplingRequest.questions.inspectionInAdvance = false;
    }
    else {
      this.orderService.waterSamplingRequest.questions.inspectionInAdvance = true;
    }
  }
  cancel(): void {
    this.scrValue = false;
  }
  cancelOrder(): void {
    this.location.back();
  }
  goBack(): void {
    if (this.redirectToProperty) {
      this.scrValue = false;
    }
    else { this.location.back(); }
  }
  goGridOrCancelOrder(): void {
    if (this.redirectToProperty) {
      this.goBackEvent.emit(true);
    }
    else { this.location.back(); }
  }
}
