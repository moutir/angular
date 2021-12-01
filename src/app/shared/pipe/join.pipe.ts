import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {

  /**
   * Transforms an array of strings to a string separated by a separator
   */
  transform(list: string[], separator: string): string {

    return (list || []).filter(Boolean).join(separator);
  }
}
