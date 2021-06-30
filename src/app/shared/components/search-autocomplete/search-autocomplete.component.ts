import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StockOverviewService } from 'src/app/modules/stock-overview/stock-overview.service';
import { BrowserStorageService } from '../../services/browser-storage/browser-storage.service';

@Component({
  selector: 'app-search-autocomplete',
  templateUrl: './search-autocomplete.component.html',
  styleUrls: ['./search-autocomplete.component.scss'],
})
export class SearchAutocompleteComponent implements OnInit {
  constructor(
    private browserService: BrowserStorageService,
    private stockOverviewService: StockOverviewService
  ) {}

  @Input() isFromNotification = false;
  @Output() onOptionSelected = new EventEmitter<any>();
  myControl = new FormControl();
  options: BuildingItem[];
  buildingList: any[];
  searchText = '';
  ngOnInit(): void {
    if (this.browserService.getSessionStorage('userProperties')) {
      this.buildingList = this.browserService.getSessionStorage(
        'userProperties'
      );
      this.options = this.buildingList;
    } else {
      this.stockOverviewService.getPropertiesWithoutChild().subscribe((m) => {
        this.browserService.setSessionStorage('userProperties', m.data.items);
        this.browserService.setlocalStorage(
          'currentPropertyId',
          m.data.items[0].id
        );
        this.buildingList = this.browserService.getSessionStorage(
          'userProperties'
        );
        this.options = this.buildingList;
      });
    }
  }

  onTextChange(): void {
    this.options = this.buildingList?.filter(
      (o) =>
        o.tehaLgNo?.includes(this.searchText) ||
        o.adminLgNo?.includes(this.searchText) ||
        o.street?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        o.postcode?.includes(this.searchText) ||
        o.place?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  optionSelected($event): void {
    this.onOptionSelected.emit($event);
    this.myControl.setValue('');
  }
}
export interface BuildingItem {
  id: number;
  tehaLgNo: string;
  adminLgNo: string;
  street: string;
  postcode: string;
  place: string;
}
