import { FolderResponseInterface } from './folder-response.interface';

export interface SettingsImapLoadResponseInterface {
  success: boolean;
  msg: string|null;
  data: {
    id: string;
    server_name: string;
    server_port: string;
    login: string;
    contact_id: string;
    no_ssl: string;
    from_cache: boolean;
    novalidate_cert: string;
    folders: FolderResponseInterface[];
    folder_name: string;
    folder_id: string;
  }|null;
}
