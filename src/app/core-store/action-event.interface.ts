import { Action } from '@ngrx/store';

export interface ActionEventInterface extends Action {

  /**
   * Type
   */
  readonly type: string;

  /**
   * Payload
   */
  payload: object;
}
