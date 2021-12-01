import { FEATURE_NAME } from '../state';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { ActionEventInterface } from '../../action-event.interface';
import { ReportGenerationModel } from '../../../shared/model/report-generation.model';

export class ReportEventChangeGenerationInput implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change generation input';
  readonly type: string = ReportEventChangeGenerationInput.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    input: InputFormInterface;
    model: ReportGenerationModel;
  }) {

  }
}
