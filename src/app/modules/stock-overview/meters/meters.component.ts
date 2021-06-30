import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { StockOverviewService } from '../stock-overview.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { Subscription } from 'rxjs';
import { BackButtonService } from '../../../shared/services/back-button.service';

@Component({
  selector: 'app-stockoverview-meters',
  templateUrl: './meters.component.html',
  styleUrls: ['./meters.component.scss'],
})
export class MetersComponent implements OnInit {
  searchText = '';
  flatId: number;
  clickEventsubscription: Subscription;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private stockOverviewService: StockOverviewService,
    private browserService: BrowserStorageService,
    private sharedService: BackButtonService
  ) {
    this.clickEventsubscription = this.sharedService.getClickEvent().subscribe(() => {
      this.goBack();
    })
  }
  toAllMetersFromMeterScreen = false;
  allMetersIndicator = false;
  meterData: any[];
  meterTableHeading = 'meterOverviewHeading';
  inProgressCountData: any;
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.flatId = parseInt(paramMap.get('id'), 10);
      if (this.flatId) {
        this.stockOverviewService.allMetersIndicator = false;
      }
    });
    this.inProgressCountData = this.stockOverviewService.inProgressCountData;
    this.allMetersIndicator = this.stockOverviewService.allMetersIndicator =
      history.state.allMeters ? true : false;
    if (this.stockOverviewService.allMetersIndicator === true) {
      this.meterTableHeading = 'allMetersHeading';
      // this.meterData = this.browserService
      //   .getSessionStorage('userProperties')
      //   .find(
      //     (p) =>
      //       p.id === this.browserService.getlocalStorage('currentPropertyId')
      //   ).generalMeters;
    }
    // if (!this.stockOverviewService.propertyData) {
    //   this.router.navigate(['/stockoverview/dashboard']);
    // }
    // console.log(this.meterData);
   this.toAllMetersFromMeterScreen =  history.state.toAllMetersFromMeterScreen ? true : false;
  }

  updateMeters($event): void {
    this.browserService.setlocalStorage('currentPropertyId', $event);
    if (this.allMetersIndicator){
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/stockoverview/allmeters'], {
          state: {
            allMeters: true,
          },
        });
      });
    }else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/stockoverview/flat', $event]);
      });
    }
  }
  goBack(): void {
    if(this.toAllMetersFromMeterScreen)
    {
      this.router.navigate(['/stockoverview/meters', this.stockOverviewService.flatId]);
    }
    else{
      this.stockOverviewService.flatId = null;
       this.router.navigate(['/stockoverview/flat', this.browserService.getlocalStorage('currentPropertyId')]);
    }
  }

  onChange(text): void {
    this.searchText = text;
  }
}
