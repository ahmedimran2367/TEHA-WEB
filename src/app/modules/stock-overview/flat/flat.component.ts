import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { StockOverviewService } from '../stock-overview.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { Subscription } from 'rxjs';
import { BackButtonService } from '../../../shared/services/back-button.service';

@Component({
  selector: 'app-stockoverview-flat',
  templateUrl: './flat.component.html',
  styleUrls: ['./flat.component.scss'],
})
export class FlatComponent implements OnInit {
  searchText = '';
  propertyId: number;
  accPeriod: string;
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
  flatData: any;
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.propertyId = parseInt(paramMap.get('id'), 10);
      this.accPeriod = this.browserService
        .getSessionStorage('userProperties')
        .find((p) => p.id === this.propertyId).billingPeriod;
    });
  }


  updateFlats($event): void {
    this.browserService.setlocalStorage('currentPropertyId', $event);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/stockoverview/flat', $event]);
    });
  }

  goBack(): void {
    this.router.navigate(['/stockoverview/dashboard']);
  }

  onChange(text): void {
    this.searchText = text;
  }
}
