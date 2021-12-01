import { ModelAbstract } from '../class/model.abstract';
import { WebsiteContentModel } from './website-content.model';
import { DocumentModel } from './document.model';
import { Dictionary } from '../class/dictionary';

export class WebsiteArticleModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'documents',
  ];

  /**
   * Article ID
   */
  id: string = '';

  /**
   * Title
   */
  title: string = '';

  /**
   * Author
   */
  author: string = '';

  /**
   * Website ID
   */
  websiteId: string = '';

  /**
   * Website URL
   */
  websiteUrl: string = '';

  /**
   * Is the article published?
   */
  isPublished: boolean = false;

  /**
   * Article contents
   */
  content: Dictionary<WebsiteContentModel> = {};

  /**
   * Documents
   */
  documents: DocumentModel[] = [];

  /**
   * Created date
   */
  creationDate: Date = null;

  /**
   * Updated date
   */
  updateDate: Date = null;
}
