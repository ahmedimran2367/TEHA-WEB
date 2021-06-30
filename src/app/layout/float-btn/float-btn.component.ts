import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';

@Component({
  selector: 'app-float-btn',
  templateUrl: './float-btn.component.html',
  styleUrls: ['./float-btn.component.scss']
})
export class FloatBtnComponent implements OnInit {
  currentPropertyId: number;
  constructor(
    private router: Router,
    private browserService: BrowserStorageService) { }

  ngOnInit(): void {
    this.currentPropertyId = this.browserService.getlocalStorage('currentPropertyId');
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
        this.router.navigate(['/orders/smokedetector']);
        break;
      case 'smokeDetectorTestMeter':
        this.browserService.setlocalStorage('testLevel', 'Meter');
        this.router.navigate(['/orders/smokedetector']);
        // this.router.navigate(['/stockoverview/allmeters'], {state: {allMeters: true}});
        break;
      case 'orderReadingProperty':
       // let id: number = this.currentPropertyId;
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
