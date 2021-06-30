import { Component, OnInit, Input } from '@angular/core';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';

@Component({
  selector: 'app-building-info-card',
  templateUrl: './building-info-card.component.html',
  styleUrls: ['./building-info-card.component.scss']
})
export class BuildingInfoCardComponent implements OnInit {
  @Input('title') title = 'Mr.';
  @Input('firstName') firstName = 'John';
  @Input('lastname') lastname = 'Doe';
  @Input('buildingname') buildingname = 'Woldowstr. 90';
  @Input('street') street = 'Freistaat Beyern';
  @Input('city') city = 'Waakirchen';
  @Input('zipcode') zipcode = '83662';
  @Input('adminNo') adminNo = '001992';
  @Input('tehaUserNo') tehaUserNo = '88769';
  @Input('flat') flats = 20;
  @Input('meters') meters = 20;
  adminLgNo: number;
  tehaLgNo: number;

  constructor(private browserService: BrowserStorageService) {}

  ngOnInit(): void {
    this.updateCard();

    this.browserService.watchStorage().subscribe(type => {
      if (type === 'currentPropertyId'){
        this.updateCard();
      }
    });
  }

  updateCard(): void {
    const properties = this.browserService.getSessionStorage('userProperties');
    const property = properties?.find(
      (p) => p.id === this.browserService.getlocalStorage('currentPropertyId')
    );

    this.street = property?.street;
    this.zipcode = property?.postcode;
    this.city = property?.place;
    this.adminLgNo = property?.adminLgNo;
    this.tehaLgNo = property?.tehaLgNo;
  }
}
