import { FolderModel } from './folder.model';
import { ClonableInterface } from '../../shared/interface/clonable.interface';

export class ImapSettingsModel implements ClonableInterface {

  id: string;
  server_name: string;
  server_port: string;
  login: string;
  contact_id: string;
  no_ssl: string;
  from_cache: boolean = false;
  novalidate_cert: string;
  folders: FolderModel[] = [];
  folder_name: string;
  folder_id: string;
  isValid: boolean = false;
  errorMessage: string;

  /**
   * @inheritDoc
   */
  clone(): ImapSettingsModel {

    const clone = new ImapSettingsModel();

    // Clone values
    Object.assign(clone, this);

    // Clone references
    clone.folders = this.folders.map(folder => folder.clone());

    return clone;
  }
}
