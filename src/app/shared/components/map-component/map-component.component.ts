import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AccountService } from 'src/app/modules/account/account.service';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss'],
})
export class MapComponent implements OnInit {
  lat: number;
  lng: number;
  title: string;
  url = '';
  @Input() isFromUser = false;
  constructor(
    private browserService: BrowserStorageService,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    console.log('mapfirst');
    this.updateCard();

    this.browserService.watchStorage().subscribe((type) => {
      if (type === 'currentPropertyId' && !this.isFromUser) {
        this.updateCard();
      }
    });
  }

  createURL(): string {
    const url =
      'https://maps.google.com/maps?q=' +
      this.lat +
      ',' +
      this.lng +
      '&t=&z=15&ie=UTF8&iwloc=&output=embed';
    return url;
  }
  updateCard(): void {
    if (this.isFromUser) {
      if (this.accountService.profileDetail) {
        this.lat = this.accountService.profileDetail.contactInformation.latitude;
        this.lng = this.accountService.profileDetail.contactInformation.longitude;
        this.title = this.accountService.profileDetail.contactInformation?.street;

        this.url =
          'https://maps.google.com/maps?q=' +
          this.accountService.profileDetail.contactInformation.street +
          ',' +
          this.accountService.profileDetail.contactInformation.place +
          ',' +
          this.accountService.profileDetail.contactInformation.postcode +
          '&t=&z=15&ie=UTF8&iwloc=&output=embed';
      } else {
        this.accountService.getUserContactInformation().subscribe((m) => {
          this.lat = m.data.latitude;
          this.lng = m.data.longitude;
          this.title = m.data.street;

          this.url =
            'https://maps.google.com/maps?q=' +
            m.data.street +
            ',' +
            m.data.place +
            ',' +
            m.data.postcode +
            '&t=&z=15&ie=UTF8&iwloc=&output=embed';
        });
      }
    } else {
      const properties = this.browserService.getSessionStorage(
        'userProperties'
      );
      const property = properties?.find(
        (p) => p.id === this.browserService.getlocalStorage('currentPropertyId')
      );
      this.lat = property?.latitude;
      this.lng = property?.longitude;
      this.title = property?.street;

      this.url =
        'https://maps.google.com/maps?q=' +
        this.lat +
        ',' +
        this.lng +
        '&t=&z=15&ie=UTF8&iwloc=&output=embed';
    }
  }
}
