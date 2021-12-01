
export interface PortalDefaultsResponseInterface {
  success: boolean;
  gateway: {
    gateway_type: string;
    sender: string;
    gateway_max_pictures: string;
    image_to_be_transferred: string;
    gateway_ftp_host: string;
    gateway_ftp_port: string;
    gateway_ftp_timeout: string;
    gateway_ftp_attempts: string;
    gateway_ftp_login: string;
    gateway_ftp_passw: string;
    gateway_ftp_pasv: string;
    gateway_ftp_data_folder: string;
    gateway_ftp_images_folder: string;
    gateway_ftp_movies_folder: string;
    gateway_ftp_docs_folder: string;
  };
}
