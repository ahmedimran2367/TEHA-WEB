import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stockoverview',
  templateUrl: './stockoverview.component.html',
  styleUrls: ['./stockoverview.component.scss']
})
export class StockoverviewComponent implements OnInit {
  constructor() {
    console.log('progress', this.propertyCountData);
  }

  @Input() propertyCountData: any;

  ngOnInit(): void {
    console.log('progress', this.propertyCountData);
  }
}
