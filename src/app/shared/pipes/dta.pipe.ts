import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dta'
})
export class DtaPipe implements PipeTransform {
  /**
   *
   */
  constructor(private translate: TranslateService) {

  }
  transform(value: unknown, ...args: unknown[]): unknown {
    let returnData = '';
    if (value === 'N') {
      this.translate.get('stockOverview.notActivated').subscribe((language) => {
        returnData = language;
      });
    }
    else {
      this.translate.get('stockOverview.activated').subscribe((language) => {
        returnData = language;
      });
    }
    return returnData;
  }

}
