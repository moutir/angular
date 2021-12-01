export interface SettingsImapSaveResponseInterface {
  id?: string;
  data: {
    email: string;
    no_ssl: number;
    novalidate_cert: number;
    password: null;
    save_password: number;
    server_name: string;
    server_port: string;
  };
  msg: string[];
  success: boolean;
}
