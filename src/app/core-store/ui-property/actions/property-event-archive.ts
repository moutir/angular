import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventArchive implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event archive';
  readonly type: string = PropertyEventArchive.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    propertyIds: string[];
  }) {

  }
}
