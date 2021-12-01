export interface EmailResponseInterface {
  id: string;
  folder_id: string;
  folder_type: string;
  sender: {
    id: null | string,
    name: string;
    email: string;
    avatar?: string;
  };
  children?: any[];
  subject: string;
  date: string;
  seen: boolean;
  deleted: string;
  contacts: Array<{
    name: string;
    email: string;
    contact_id: string;
    contact_firstname: string;
    contact_lastname: string;
    recipient_type: string;
    from_imap: string;
    archived: string;
  }>;
  properties: any[];
  promotions: any[];
}
