import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
})
export class ReversePipe implements PipeTransform {

  transform(arr): any {

    return arr.slice().reverse();
  }

}
