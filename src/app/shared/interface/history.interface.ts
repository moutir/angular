import { EntityEnum } from '../enum/entity.enum';

export interface HistoryInterface {
  entity: EntityEnum;
  entityId: string;
  entityLabel: string;
}
