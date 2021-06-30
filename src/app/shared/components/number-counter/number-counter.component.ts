import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-number-counter',
  templateUrl: './number-counter.component.html',
  styleUrls: ['./number-counter.component.scss'],
})
export class NumberCounterComponent implements OnInit, OnChanges {
  @Input('number') number = 0;
  @Input() code: string;
  @Input('disable') disable = false;
  @Input('parentModule') parentModule: string;
  @Output('measuringInstrumentCountChange')
  measuringInstrumentCountChange: EventEmitter<any> = new EventEmitter<object>();
  constructor() {}

  ngOnInit(): void {}

  addNumber(): void {
    this.number = parseInt(this.number.toString(), 10) + 1;
    if (isNaN(this.number)) {
      this.number = 0;
    }
    this.measuringInstrumentCountChange.emit({
      code: this.code,
      count: parseInt(this.number.toString(), 10),
    });
  }

  subtractNumber(): void {
    if (isNaN(this.number)) {
      this.number = 0;
    }
    if (parseInt(this.number.toString(), 10) == 0) {
      return;
    }
    this.number = parseInt(this.number.toString(), 10) - 1;
    this.measuringInstrumentCountChange.emit({
      code: this.code,
      count: parseInt(this.number.toString(), 10),
    });
  }
  ngOnChanges(): void {
    if (this.disable) {
      this.number = 0;
    }
  }
}
