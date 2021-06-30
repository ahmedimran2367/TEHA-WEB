import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @ViewChild('searchInputElement') searchInputElement: ElementRef;
  @Input() searchText: string;
  @Output() changed = new EventEmitter<string>();
  @Output() enterPressed = new EventEmitter<any>();
  @Output() backspace = new EventEmitter<any>();
  @Input() placeHolder = 'Search (Admin User No., Location, etc)';
  constructor( private translate: TranslateService) {
    this.translate
      .get([
        'stockOverview.defaultSearchPlaceholder'
      ])
      .subscribe((values) => {
        this.placeHolder = values['stockOverview.defaultSearchPlaceholder'];
      });
  }

  ngOnInit(): void {
  }
}
