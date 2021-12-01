import { FEATURE_NAME, UiReportStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { ReportBrochureMenuInterface } from '../../../shared/interface/report-brochure-menu.interface';

export class ReportUpdateBrochureMenu implements ActionUpdateInterface<UiReportStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update brochure menu';
  readonly type: string = ReportUpdateBrochureMenu.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    brochureMenu: ReportBrochureMenuInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiReportStateInterface): UiReportStateInterface {

    return {
      ...state,
      brochureMenu: {
        ...state.brochureMenu,
        ...this.payload.brochureMenu,
      },
    };
  }
}
