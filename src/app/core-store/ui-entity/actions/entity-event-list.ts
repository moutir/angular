import { FEATURE_NAME } from '../state';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { ActionEventInterface } from '../../action-event.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ListFiltersInterface } from '../../../shared/interface/list-filters.interface';

export class EntityEventList implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event list';
  readonly type: string = EntityEventList.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum,
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ListFiltersInterface,
  }) {

  }
}
