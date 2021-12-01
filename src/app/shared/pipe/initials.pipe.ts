import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
})
export class InitialsPipe implements PipeTransform {

  /**
   * Transforms a name into its initials
   */
  transform(name: string): string {

    const initials = (name || '').split(' ');

    return ((initials.shift() || '').charAt(0) + (initials.pop() || '').charAt(0)).toUpperCase();
  }
}
