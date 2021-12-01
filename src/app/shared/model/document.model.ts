import { Dictionary } from '../class/dictionary';
import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';

export class DocumentModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'createContact',
    'updateContact',
  ];

  // Attributes
  id: string = '';
  name: string = '';
  size: number = 0;
  fileUrl: string = '';
  photoSmallURL: string = '';
  photoLargeURL: string = '';
  extension: string = '';
  tag: string = '';
  isAgencyWatermark: boolean = false;
  isAgencyLogo: boolean = false;
  isUserAvatar: boolean = false;
  isDefaultPropertyImage: boolean = false;
  isEmailBanner: boolean = false;
  isPrestigeBrochureCover: boolean = false;
  isSignature: boolean = false;
  createContact: ContactModel = new ContactModel();
  createDate: Date|null = null;
  updateContact: ContactModel = new ContactModel();
  updateDate: Date|null = null;

  /**
   * Data defined at runtime
   */
  data: Dictionary<string|string[]|Date|boolean|null|number|ModelAbstract|ModelAbstract[]> = {};

  // UI usage
  isRemoved: boolean = false;
}
