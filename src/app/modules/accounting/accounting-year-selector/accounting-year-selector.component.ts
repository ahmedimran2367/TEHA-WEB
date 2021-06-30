import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-accounting-year-selector',
  templateUrl: './accounting-year-selector.component.html',
  styleUrls: ['./accounting-year-selector.component.scss'],
})
export class AccountingYearSelectorComponent implements OnInit {
  @Output('onPayrollYearChange')
  onPayrollYearChange: EventEmitter<any> = new EventEmitter();
  constructor(private translate: TranslateService) { }
  selectedAccountingPeriod: string;
  yearList = [];
  isAll = true;
  ngOnInit(): void {
    let year = new Date().getFullYear();
    this.yearList.push((year).toString());
    this.yearList.push((--year).toString());
    this.yearList.push((--year).toString());
    this.translate.get('accounting.accountingPeriodAccountingSelector').subscribe((value) => {
      this.selectedAccountingPeriod = value;
    });
  }
  choosedYear(year): void {
    this.selectedAccountingPeriod = year.toString();
    this.onPayrollYearChange.emit(year.toString());
    this.isAll = false;
  }
  showAll(): void {
    this.translate.get('accounting.accountingPeriodAccountingSelector').subscribe((value) => {
      this.selectedAccountingPeriod = value;
      this.isAll = true;
    });
    this.onPayrollYearChange.emit(null);
  }
}
