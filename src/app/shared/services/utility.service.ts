import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() { }

  toCamelCase(str: string): string {
    if (str == null) {
      return 'null';
    }
    if (str === str.toUpperCase()) { return str.toLowerCase(); }
    return str
      .replace(/\s(.)/g, function (a): string {
        return a.toUpperCase();
      })
      .replace(/\s/g, '')
      .replace(/^(.)/, function (b): string {
        return b.toLowerCase();
      });
  }

  fixSalutationCode(str: string): string {
    return str.substr(0, 2).toLowerCase() + str.substr(2, str.length);
  }

  setDateFormat(value): any {
    if (value != null) {
      const d = new Date(value);
      return moment(d).format('YYYY-MM-DD');
    }
    else {
      return value;
    }
  }
  convertTime12to24 = (time12h) => {
    if (time12h) {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') {
        hours = '00';
      }
      if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
      }
      if (hours < 10 && hours.length < 2) {
        hours = 0 + hours;
      }
      return `${hours}:${minutes}`;
    }
    else {
      return null;
    }
  }
  add30Minuts(str: string): string {
    return moment(str, 'h:mm A')
      .add(30, 'minutes')
      .format('LT');
  }
  replaceDotWithComma(data) {
    if (data != null) {
      let re = /\./gi;
      return data.toString().replace(re, ",");
    }
    else {
      return data;
    }
  }
  germanDecimalToActual(data) {
    if (data != null) {
      data=data.toString().replace(/\,/gi, "&").replace(/\./gi, "").replace(/\&/gi, ".");
      return Number(data);
    }
    else {
      return 0;
    }
  }
}
