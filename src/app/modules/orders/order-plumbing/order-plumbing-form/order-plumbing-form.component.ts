import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { Meter } from 'src/app/modules/stock-overview/models/meter.model';
import { StockOverviewService } from 'src/app/modules/stock-overview/stock-overview.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrderPlumbingRequest } from '../../models/order-plumbing-request.model';
@Component({
  selector: 'app-order-plumbing-form',
  templateUrl: './order-plumbing-form.component.html',
  styleUrls: ['./order-plumbing-form.component.scss']
})
export class OrderPlumbingFOrmComponent implements OnInit {
  floatLabelControl = new FormControl('auto');
  alternativeInd = false;
  @Input() orderPlumbingRequestNew = new OrderPlumbingRequest();
  @Input() orderPlumbingRequestCurrent = new OrderPlumbingRequest();
  @ViewChild('firstForm') firstForm;
  @ViewChild('altUserForm') altUserForm;
  currentMeter: Meter;
  today: Date = new Date();
  public toMin: any = '07:30 am';
  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#fff',
      buttonColor: '#6c6c6c'
    },
    dial: {
      dialBackgroundColor: '#fff',
      dialInactiveColor: '#c5c5c5',
      dialActiveColor: '#6c6c6c'
    },
    clockFace: {
      clockFaceBackgroundColor: '#f0f0f0',
      clockHandColor: '#6c6c6c',
      clockFaceTimeInactiveColor: '#6c6c6c'
    }
  };
  constructor(public defaultDataService: DefaultDataService,
              public stockOverviewService: StockOverviewService,
              private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.currentMeter = this.stockOverviewService.meterData?.find(m => m.id === this.orderPlumbingRequestNew.meterIds[0]);
  }
  resetForm(): void {
    this.firstForm.resetForm();
  }
  timeChange(newTimeE: string): void {
    this.toMin = this.utilityService.add30Minuts(newTimeE);
  }
  showOptions(event): void {
    if (event.checked) {
      this.alternativeInd = true;
    }
    else {
      this.alternativeInd = false;
      this.altUserForm?.resetForm();
    }
  }
}
