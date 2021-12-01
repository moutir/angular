import { ClonableInterface } from '../../shared/interface/clonable.interface';

export class FolderModel implements ClonableInterface {

  id: string;
  name: string;
  type: string;
  type_id: string;
  unseen: number;
  hasSubFolder: boolean;

  /**
   * @inheritDoc
   */
  clone(): FolderModel {

    const clone = new FolderModel();

    // Clone values
    Object.assign(clone, this);

    return clone;
  }
}
