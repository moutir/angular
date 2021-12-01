import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class RuntimeEventError implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event error';
  readonly type: string = RuntimeEventError.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    id: string;
    error: object|string|Error;
    message?: string;
  }) {

    if (this.payload.error instanceof Error) {

      this.payload.message = this.payload.error.toString();

    } else if (typeof this.payload.error === 'object') {

      this.payload.message = JSON.stringify(this.payload.error);

    } else if (typeof this.payload.error === 'string') {

      this.payload.message = this.payload.error;
    }

    console.error('[Runtime Error ' + this.payload.id + ']', this.payload.message);
  }
}
