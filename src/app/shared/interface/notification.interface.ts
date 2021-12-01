import { NotificationTypeEnum } from '../enum/notification-type.enum';

export interface NotificationInterface {
  timestamp: number;
  message: string;
  type: NotificationTypeEnum;
}
