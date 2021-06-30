import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'germanDecimal'
})
export class GermanDecimalPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value == null || value == 0) {
      return null;
    }
    value = value.toString().replace(/\./g, '$').replace(/\,/g, '.').replace(/\$/g, ',');
    return value;
  }

}
