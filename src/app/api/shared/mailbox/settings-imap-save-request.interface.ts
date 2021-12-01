export interface SettingsImapSaveRequestInterface {
  email: string;
  password: string;
  'imap-server': string;
  'imap-port': string;
  store_password: boolean;
  no_ssl: number;
  novalidate_cert: number;
}
