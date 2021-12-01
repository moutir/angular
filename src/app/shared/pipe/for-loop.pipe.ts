import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'forLoop',
})
export class ForLoopPipe implements PipeTransform {

  /**
   * Transforms a value into an array of indexes, usefull to generate for loops based on a number instead of a collection.
   *
   * @usage <div *ngFor="let i of 5|forLoop"></div> will generate 5 divs.
   */
  transform(value: number): number[] {

    const indexes = [];

    for (let i = 0; i < value; i++) {

      indexes.push(i);
    }

    return indexes;
  }
}
