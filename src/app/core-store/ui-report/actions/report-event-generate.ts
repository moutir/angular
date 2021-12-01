import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { ReportGenerationInterface } from '../../../shared/interface/report-generation.interface';

export class ReportEventGenerate implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event generate';
  readonly type: string = ReportEventGenerate.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    generation: ReportGenerationInterface;
  }) {

  }
}
