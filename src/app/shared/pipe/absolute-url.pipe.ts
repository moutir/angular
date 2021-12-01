import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'absoluteUrl',
})
export class AbsoluteUrlPipe implements PipeTransform {

  /**
   * Transforms a string into an absolute
   */
  transform(url: string): string {

    return (url.indexOf('http') !== 0 && url.indexOf('//') !== 0 ? '//' : '') + url;
  }
}
