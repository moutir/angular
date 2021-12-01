import { MailboxModel } from './mailbox.model';
import { FolderModel } from './folder.model';

export class MailboxListModel {
  totalCount: number;
  filteredCount: number;
  unreadCount: number;
  perPageCount: number;
  totalPageCount: number;
  folders: FolderModel[];
  emails: MailboxModel[];
}
