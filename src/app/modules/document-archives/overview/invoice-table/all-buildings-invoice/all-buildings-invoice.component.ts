import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-buildings-invoice',
  templateUrl: './all-buildings-invoice.component.html',
  styleUrls: ['./all-buildings-invoice.component.scss']
})
export class AllBuildingsInvoiceComponent implements OnInit {

  selectedPayrollYear: number;
  accPeriod: string;
  constructor() { }

  ngOnInit() {
  }

  onPayrollYearChange($event): void {
    console.log($event);
    this.selectedPayrollYear = $event === 'all' ? null : $event.id;
    this.accPeriod =  $event.year + ' (' + $event.to + ') to (' + $event.from + ')';
  }

  goBack(): void {
    history.back();
  }
}
