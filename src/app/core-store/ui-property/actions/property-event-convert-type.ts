import { FEATURE_NAME } from '../state';
import { TypeEnum } from '../../../shared/enum/type.enum';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventConvertType implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event convert type';
  readonly type: string = PropertyEventConvertType.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    propertyIds: string[];
    type: TypeEnum;
  }) {

  }
}
