import { OptionInterface } from './option.interface';

export interface TaskOptionsInterface {
  type: OptionInterface[];
  reminderAt: OptionInterface[];
  agenda: OptionInterface[];
  broker: OptionInterface[];
}
