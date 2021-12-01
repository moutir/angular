export class MailboxModel {

  id: string;
  folderId: string;
  folderType: string;
  sender: {
    id: null | string,
    name: string;
    email: string;
  };
  subject: string;
  timestamp: number;
  isRead: boolean;
  isDeleted: boolean;
  children: any;
  properties: any;
  promotions: any;
  contacts: any;
  to: any[];
  cc: any[];
  bcc: any[];

  // TODO[later] set by a EmailListComponent on the fly... figure out if really needed or can handle differently
  contactsConnected: any;
  connectMode: any;
  editMode: boolean;
  modalState: string;
}
