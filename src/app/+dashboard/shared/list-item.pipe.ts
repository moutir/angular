import { Pipe, PipeTransform } from '@angular/core';

import { ListItemModel } from './list-item.model';

@Pipe({
  name: 'listItem',
  pure: false,
})
export class ListItemPipe implements PipeTransform {

  transform(items: ListItemModel[], filter: ListItemModel): ListItemModel[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item) => this.applyFilter(item, filter));
  }

  /**
   * Perform the filtering
   */
  applyFilter(item: ListItemModel, filter: ListItemModel): boolean {
    if (filter.itemName && item.itemName.toLowerCase().indexOf(filter.itemName.toLowerCase()) === -1) {
      return false;
    }
    return true;
  }
}
