import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { CurrencyPipe } from './currency.pipe';

@Directive({selector: '[currencyFormatter]'})
export class CurrencyFormatterDirective implements OnInit {

  private el: any;

  constructor(private elementRef: ElementRef,
              private currencyPipe: CurrencyPipe) {
    this.el = this.elementRef.nativeElement;

  }

  ngOnInit(): void {
    this.el.value = this.currencyPipe.transform(this.el.value);
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value) {
    this.el.value = this.currencyPipe.transform(value);
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value) {
    this.el.value = this.currencyPipe.transform(value);
  }

}
