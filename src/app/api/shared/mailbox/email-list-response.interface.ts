import { FolderResponseInterface } from './folder-response.interface';
import { EmailResponseInterface } from './email-response.interface';

export interface EmailListResponseInterface {
  recordsTotal: string;
  recordsFiltered: string;
  page: string;
  per_page: number;
  count_unseen: string;
  folders: FolderResponseInterface[];
  data: EmailResponseInterface[];
}
