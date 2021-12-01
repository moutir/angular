import { ActionEventInterface } from '../../action-event.interface';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { FEATURE_NAME } from '../state';

export class PageEventChangeModel implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change model';
  readonly type: string = PageEventChangeModel.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    model: ModelAbstract,
    input: InputFormInterface,
  }) {

  }
}
