import { Component, OnInit } from '@angular/core';
import { StockOverviewService } from '../stock-overview.service';
@Component({
  selector: 'app-stockoverview-dashboard-',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  searchText = '';
  propertyId: number;
  propertyCountData = {
    buildingsCount : 0,
    flatsCount : 0,
    metersCount : 0,
  };

  inProgressCountData = {
    pendingAccountingBuildingsCount : 0,
    pendingFeedbackOpenLettersCount : 0,
    pendingFeedbackOpenOffersCount : 0,
    defectedSmokeDetectorsBuildingsCount : 0,
  };
  constructor(private stockoverviewService: StockOverviewService) {}

  ngOnInit(): void {
    console.log(history.state);
    this.searchText = history.state.searchText;
    this.propertyId = history.state.propertyId;
    this.stockoverviewService.getSummary().subscribe((m) => {
      this.stockoverviewService.flatsCount = m.data.flatsCount;
      this.stockoverviewService.metersCount = m.data.metersCount;

      this.propertyCountData.buildingsCount = m.data.buildingsCount;
      this.propertyCountData.flatsCount = m.data.flatsCount;
      this.propertyCountData.metersCount = m.data.metersCount;
      this.inProgressCountData.pendingAccountingBuildingsCount = m.data.pendingAccountingBuildingsCount;
      this.inProgressCountData.pendingFeedbackOpenLettersCount = m.data.pendingFeedbackOpenLettersCount;
      this.inProgressCountData.pendingFeedbackOpenOffersCount = m.data.pendingFeedbackOpenOffersCount;
      this.inProgressCountData.defectedSmokeDetectorsBuildingsCount = m.data.defectedSmokeDetectorsBuildingsCount;
      this.stockoverviewService.inProgressCountData = this.inProgressCountData;
    });
  }

  onChange(text): void {
    this.searchText = text;
  }
}
