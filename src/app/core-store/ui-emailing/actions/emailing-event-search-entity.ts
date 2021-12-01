import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { ListFiltersInterface } from '../../../shared/interface/list-filters.interface';

export class EmailingEventSearchEntity implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event search entity';
  readonly type: string = EmailingEventSearchEntity.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    uid: string;
    pagination: PaginationInterface;
    sort: SortInterface;
    filters: ListFiltersInterface;
  }) {

  }
}
