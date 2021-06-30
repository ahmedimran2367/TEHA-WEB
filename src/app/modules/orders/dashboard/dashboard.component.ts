import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentPropertyId: number;
  helloCardText = '';
  constructor(
    private router: Router,
    private browserService: BrowserStorageService,
    private translate: TranslateService,) { }

  ngOnInit(): void {
    this.currentPropertyId = this.browserService.getlocalStorage('currentPropertyId');
    this.translate
    .get('miscellaneous.helloCardWelcomeForMyOrder')
    .subscribe((value) => {
      this.helloCardText = value;
    });
  }

  navigateToOrder(type): void {
    switch (type) {
      case 'drinkingWaterSampling':
        this.router.navigate(['/orders/wateranalysis']);
        break;
      case 'energyCertificate':
        this.router.navigate(['/orders/energyperformancecertificate']);
        break;
      case 'interimReading':
        this.router.navigate(['/orders/interimreading']);
        // this.router.navigate(['/orders/interimreading']);
        break;
      case 'offer':
        this.router.navigate(['/orders/offerrequest']);
        break;
      case 'plumbingFlat':
        this.browserService.setlocalStorage('plumbingLevel', 'MyOrderFloatFlat');
        this.router.navigate(['/orders/plumbing']);
        break;
      case 'plumbingMeter':
        this.browserService.setlocalStorage('plumbingLevel', 'MyOrderFloatMeter');
        this.router.navigate(['/orders/plumbing']);
        break;
      case 'postInterimReading':
        this.router.navigate(['/orders/enterintermreading']);
        break;
      case 'smokeDetectorTestFlat':
        this.browserService.setlocalStorage('testLevel', 'Flat');
        this.router.navigate(['/orders/smokedetector']);
        // this.router.navigate(['/stockoverview/flat', this.currentPropertyId]);
        break;
      case 'smokeDetectorTestMeter':
        this.browserService.setlocalStorage('testLevel', 'Meter');
        this.router.navigate(['/orders/smokedetector']);
        // this.router.navigate(['/stockoverview/allmeters'], {state: {allMeters: true}});
        break;
      case 'orderReadingProperty':
        this.browserService.setlocalStorage('readingLevel', 'floatingOrMyordrsProperty');
        this.router.navigate(['/orders/reading']);
        break;
      case 'orderReadingFlat':
        this.browserService.setlocalStorage('readingLevel', 'floatingOrMyordrsFlat');
        this.router.navigate(['/orders/reading']);
        break;
      case 'orderReadingMeter':
        this.browserService.setlocalStorage('readingLevel', 'floatingOrMyordrsMeter');
        this.router.navigate(['/orders/reading']);
        break;
      default:
        break;
    }
  }
}
