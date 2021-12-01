import { OrderEnum } from '../../../shared/enum/order.enum';

export interface TaskListRequestInterface {
  page: number; // page number
  sort: string; // sort column
  direction: OrderEnum; // sort order
  sr_task_type?: string;
  sr_start_date?: string;
  sr_end_date?: string;
  addressee_search?: string[];
  property_search?: string[];
  promotion_search?: string[];
  assignee_search?: string[];
  sr_finished?: string;
}
