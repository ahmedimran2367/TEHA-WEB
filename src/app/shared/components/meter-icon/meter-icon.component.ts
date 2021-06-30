import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-meter-icon',
  templateUrl: './meter-icon.component.html',
  styleUrls: ['./meter-icon.component.scss']
})
export class MeterIconComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('icon') icon: string;
  // tslint:disable-next-line:no-input-rename
  @Input('color') color: string;
  // tslint:disable-next-line:no-input-rename
  @Input('text') text: string;
  // tslint:disable-next-line:no-input-rename
  @Input('unit') unit: string;
  // tslint:disable-next-line:no-input-rename
  @Input('number') number: any;
  constructor() {}

  ngOnInit(): void {}
}
