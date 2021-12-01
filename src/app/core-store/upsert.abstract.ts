import { ModelAbstract } from '../shared/class/model.abstract';
import { ActionUpdateInterface } from './action-update.interface';
import { DataStateInterface } from './data-state.interface';

export abstract class UpsertAbstract<
  Model extends ModelAbstract,
  State extends DataStateInterface<Model>,
> implements ActionUpdateInterface<State> {

  /**
   * Type constant
   */
  static readonly TYPE: string;

  /**
   * @inheritDoc
   */
  readonly abstract type: string = UpsertAbstract.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    models: Model[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: State): State {

    const newState = {
      ...state,
      models: {},
    };

    Object.keys(state.models).forEach(id => newState.models[id] = state.models[id]);

    this.payload.models.forEach(model => newState.models[model.id] = model);

    return newState;
  }
}
