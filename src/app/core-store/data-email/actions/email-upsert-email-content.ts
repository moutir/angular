import { DataEmailStateInterface, FEATURE_NAME } from '../state';
import { EmailContentModel } from '../../../shared/model/email-content.model';
import { ActionUpdateInterface } from '../../action-update.interface';

export class EmailUpsertEmailContent implements ActionUpdateInterface<DataEmailStateInterface> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert email content';
  readonly type: string = EmailUpsertEmailContent.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    models: EmailContentModel[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataEmailStateInterface): DataEmailStateInterface {

    const newState = {
      ...state,
      emailContent: {
        models: {},
      },
    };

    Object.keys(state.emailContent.models).forEach(id => newState.emailContent.models[id] = state.emailContent.models[id]);

    this.payload.models.forEach(model => newState.emailContent.models[model.id] = model);

    return newState;
  }
}
