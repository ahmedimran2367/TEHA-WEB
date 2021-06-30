import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DocumentArchivesService } from '../../document-archives.service';

@Component({
  selector: 'app-year-selector-component',
  templateUrl: './year-selector-component.component.html',
  styleUrls: ['./year-selector-component.component.scss'],
})
export class YearSelectorComponentComponent implements OnInit {
  yearList: any[];
  @Output() yearChange = new EventEmitter<any>();

  selectedPayrollId: number;
  // selectedAccountingPeriod = 'Accounting Period';
  selectedAccountingPeriod = '';
  constructor(
    private documentArchivesService: DocumentArchivesService,
    private translate: TranslateService
  ) {
    this.translate.get('documentArchives.accountingPeriodDoc').subscribe((value) => {
      this.selectedAccountingPeriod = value;
    });
    this.documentArchivesService.getPayrollYear().subscribe((m) => {
      this.yearList = m.data;
      this.yearList.map((t) => {
        t.year = t.from.split('-')[0];
      });
    });
  }

  ngOnInit(): void {}

  choosedDate($event: any): void {
    this.selectedPayrollId = $event.id;
    console.log('Choose Date', $event);
    this.selectedAccountingPeriod =
      $event.year + ' (' + $event.to + ') to (' + $event.from + ')';
    this.yearChange.emit($event);
  }
  showAll(): void {
    // this.selectedAccountingPeriod = 'Accounting Period';
    this.translate.get('documentArchives.accountingPeriodDoc').subscribe((value) => {
      this.selectedAccountingPeriod = value;
    });
    this.yearChange.emit('all');
    this.selectedPayrollId = null;
  }
}
