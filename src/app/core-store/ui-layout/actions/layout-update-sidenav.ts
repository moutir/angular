import { FEATURE_NAME, UiLayoutStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { SidenavInterface } from '../../../shared/interface/sidenav.interface';

export class LayoutUpdateSidenav implements ActionUpdateInterface<UiLayoutStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update sidenav';
  readonly type: string = LayoutUpdateSidenav.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    sidenav: SidenavInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiLayoutStateInterface): UiLayoutStateInterface {

    return {
      ...state,
      sidenav: {
        ...this.payload.sidenav,
      },
    };
  }
}
