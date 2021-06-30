import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';

@Component({
  selector: 'app-document-archives',
  templateUrl: './document-archives.component.html',
  styleUrls: ['./document-archives.component.scss'],
})
export class DocumentArchivesComponent implements OnInit {
  @ViewChild('plumbingComponent') plumbingComponent;
  @ViewChild('accountingTabComponent') accountingTabComponent;
  @ViewChild('readingTabComponent') readingTabComponent;
  @ViewChild('allDocumentComponent') allDocumentComponent;
  constructor(
    private router: Router,
    private browserService: BrowserStorageService
  ) {}

  hiddenBackButton = true;
  hiddenAccountingTable = false;
  hiddenDropdown = false;
  hideSearchBar = true;
  tabid = 0;
  defaultSelected = '';
  selectedPayrollYear: number;
  accPeriod: string;
  selectedTabName: string;
  selectTabNameHeading: any[] = [
    { code: 'tab0', text: 'Invoice Overview' },
    { code: 'tab1', text: 'Accounting Documents' },
    { code: 'tab2', text: 'Reading Documents' },
    { code: 'tab3', text: 'Plumbing Documents' },
    { code: 'tab4', text: 'Energy Certificate Documents' },
    { code: 'tab5', text: 'Drinking Water Supply Documents' },
    { code: 'tab6', text: 'All Documents' },
    { code: 'tab7', text: 'SEPA Direct Debit Mandate' },
    { code: 'tab8', text: 'Accounting Documents - Flat' },
  ];

  ngOnInit(): void {
    this.tabid = 0;

    this.selectedTabName = this.selectTabNameHeading[0].code;
  }

  updateDocuments($event): void {
    this.browserService.setlocalStorage('currentPropertyId', $event);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/documentarchives']);
    });
  }
  onPayrollYearChange($event): void {
    console.log($event);
    this.selectedPayrollYear = $event === 'all' ? null : $event.id;
    this.accPeriod =  $event.year + ' (' + $event.to + ') to (' + $event.from + ')';
  }

  onSearchChange($event): void {
    switch (this.tabid) {
      case 1:
        this.accountingTabComponent.searchChanged($event);
        break;
      case 2:
        this.readingTabComponent.searchChanged($event);
        break;
      case 3:
        this.plumbingComponent.searchChanged($event);
        break;
      case 6:
        this.allDocumentComponent.searchChanged($event);
        break;
      default:
        break;
    }
  }
  tabChanged($event: any): void {
    this.tabid = $event.index;

    this.allDocumentComponent.tabGroup.selectedIndex = 0;
    this.readingTabComponent.tabGroup.selectedIndex = 0;
    this.accountingTabComponent.tabGroup.selectedIndex = 0;
    this.plumbingComponent.tabGroup.selectedIndex = 0;

    if (
      this.tabid === 0 ||
      this.tabid === 1 ||
      this.tabid === 2 ||
      this.tabid === 6
    ) {
      this.hiddenDropdown = false;
    } else {
      this.hiddenDropdown = true;
    }
    if (this.tabid !== 3 && this.tabid !== 1) {
      this.hideSearchBar = true;
    }
    if (this.hiddenAccountingTable === true) {
      this.selectedTabName = this.selectTabNameHeading[8].code;
      this.hiddenBackButton = true;
      this.hiddenAccountingTable = false;
      this.selectedTabName = this.selectTabNameHeading[this.tabid].code;
    } else {
      this.selectedTabName = this.selectTabNameHeading[this.tabid].code;
    }
  }
  showSpecificFlatTable(): void {
    this.hiddenBackButton = false;
    this.hiddenAccountingTable = true;
    this.selectedTabName = this.selectTabNameHeading[8].code;
  }
  goBackFromSpecificFlatTable(): void {
    this.hiddenBackButton = true;
    this.hiddenAccountingTable = false;
    this.selectedTabName = this.selectTabNameHeading[this.tabid].code;
  }
}
