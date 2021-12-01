import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
})
export class FormatNumberPipe implements PipeTransform {

  transform(value: number|string): string {

    const val = (value || '').toString();

    if (val === '0' || val === '') {

      // TODO[later] use data-option number format, this '.-' is very Swiss
      return '0.-';
    }

    return parseFloat(val.replace(/[^0-9\-.]/g, ''))
      .toFixed(2)
      .toString()
      .replace('.00', '.-')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '\'');
  }
}
