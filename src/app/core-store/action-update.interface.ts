import { Action } from '@ngrx/store';

export interface ActionUpdateInterface<S> extends Action {

  /**
   * Type
   */
  readonly type: string;

  /**
   * Payload
   */
  payload: object;

  /**
   * Return a new state based on the action's payload, yes we consciously "hard link" 1 action to 1 reducer only
   */
  reduce(state: S): S;
}
