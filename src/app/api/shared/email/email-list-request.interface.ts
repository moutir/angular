import { OrderEnum } from '../../../shared/enum/order.enum';

export interface EmailListRequestInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order

  // Email related filters
  subject?: string;
  startDate?: string;
  endDate?: string;
  attachments?: string;
  delivery?: string[];
  propertyId?: string[];
  promotionId?: string[];
  recipientId?: string[];
  senderId?: string[];
  ids?: string[];
}
