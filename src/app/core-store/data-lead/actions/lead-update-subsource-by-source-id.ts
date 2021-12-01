import { DataLeadStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';

export class LeadUpdateSubsourceBySourceId implements ActionUpdateInterface<DataLeadStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update source by source ID';
  readonly type: string = LeadUpdateSubsourceBySourceId.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    sourceId: string;
    subSources: OptionInterface[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataLeadStateInterface): DataLeadStateInterface {

    const newState = {
      ...state,
      subSourceBySourceId: {
        ...state.subSourceBySourceId,
      },
    };

    newState.subSourceBySourceId[this.payload.sourceId] = this.payload.subSources;

    return newState;
  }
}
