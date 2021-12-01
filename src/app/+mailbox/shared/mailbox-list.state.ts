import { ClonableInterface } from '../../shared/interface/clonable.interface';

export class MailboxListState implements ClonableInterface {

  /**
   * Page
   */
  page: number;

  /**
   * Folder ID
   */
  folderId: string;

  /**
   * Search query
   */
  searchQuery: string;

  /**
   * Constructor
   */
  constructor() {

    // Default values
    this.page = 1;
    this.folderId = '';
    this.searchQuery = '';
  }

  /**
   * @inheritDoc
   */
  clone(): MailboxListState {

    const clone = new MailboxListState();

    // Clone values
    Object.assign(clone, this);

    return clone;
  }
}
