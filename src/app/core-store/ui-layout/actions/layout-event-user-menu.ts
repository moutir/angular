import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { PositionInterface } from '../../../shared/interface/position.interface';

export class LayoutEventUserMenu implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event user menu';
  readonly type: string = LayoutEventUserMenu.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    position: PositionInterface;
  }) {

  }
}
