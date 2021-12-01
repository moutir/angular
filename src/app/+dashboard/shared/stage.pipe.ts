import { Pipe, PipeTransform } from '@angular/core';
import { ClientModel } from './client.model';

@Pipe({
  name: 'stage',
})
export class StagePipe implements PipeTransform {

  /**
   * Return a sorted list of contacts that belong to the @stage
   */
  transform(contacts: ClientModel[], stage: number): ClientModel[] {

    return contacts
      .filter(item => item.stage === stage)
      .sort((a, b) => (a.days > b.days) ? 1 : -1);
  }
}
