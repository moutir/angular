import { EmailResponseInterface } from './email-response.interface';

export interface EmailLoadResponseInterface extends EmailResponseInterface {
  text: string;
  mark_seen: boolean;
  attachments_list: Array<{
    mime_type: string;
    name: string;
  }>;
}
