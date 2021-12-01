import { FEATURE_NAME, UiReportStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { ReportGenerationInterface } from '../../../shared/interface/report-generation.interface';

export class ReportUpdateGeneration implements ActionUpdateInterface<UiReportStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update generation';
  readonly type: string = ReportUpdateGeneration.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    generation: ReportGenerationInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiReportStateInterface): UiReportStateInterface {

    return {
      ...state,
      generation: {
        ...state.generation,
        ...this.payload.generation,
      },
    };
  }
}
