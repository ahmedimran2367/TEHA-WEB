import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericSpecialCharactersOnly]'
})
export class NumericSpecialCharactersOnlyDirective {

  // Allow decimal numbers. The \. is only allowed once to occur
  private regex: RegExp = new RegExp(/^[0-9!@#$&()`.+,/"-]*$/);

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];
  constructor(private el: ElementRef) {

  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): any {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    // We need this because the current value on the DOM element
    // is not yet updated with the value from this event
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

}
