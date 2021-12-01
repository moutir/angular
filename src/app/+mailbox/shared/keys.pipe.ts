import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys',
})
export class KeysPipe implements PipeTransform {

  transform(value): any {
    const keys = [];
    for (const key in value) {
      if (typeof value[key] === 'object') {
        keys.push(key);
      }
    }
    return keys;
  }

}
