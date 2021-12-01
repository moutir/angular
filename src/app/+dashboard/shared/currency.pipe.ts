import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'myCurrency'})
export class CurrencyPipe implements PipeTransform {

  transform(value: string, fractionSize: number = 2): string {
    value = value.replace('\'', '');
    return value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1\'');
  }

}
