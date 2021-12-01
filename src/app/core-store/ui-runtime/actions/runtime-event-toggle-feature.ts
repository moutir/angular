import { FEATURE_NAME } from '../../data-runtime/state';
import { RuntimeFeatureInterface } from '../../../shared/interface/runtime-feature.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class RuntimeEventToggleFeature implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event toggle feature';
  readonly type: string = RuntimeEventToggleFeature.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    name: keyof RuntimeFeatureInterface;
  }) {

  }
}
