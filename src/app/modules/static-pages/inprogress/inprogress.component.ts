import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inprogress',
  templateUrl: './inprogress.component.html',
  styleUrls: ['./inprogress.component.scss']
})
export class InprogressComponent implements OnInit {
  constructor() {
    console.log('progress', this.inProgressCountData);
  }
  @Input() allMetersIndicator: boolean;
  @Input() inProgressCountData: any;

  ngOnInit(): void {
    console.log('progress', this.inProgressCountData);
  }

}
