import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { ExportTypeEnum } from '../../../shared/enum/export-type.enum';

export class HistoryEventExport implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event export';
  readonly type: string = HistoryEventExport.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    type: ExportTypeEnum;
    entity: EntityEnum;
    entityId: string;
  }) {

  }
}
