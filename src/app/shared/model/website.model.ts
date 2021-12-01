import { ModelAbstract } from '../class/model.abstract';
import { WebsiteContentModel } from './website-content.model';
import { ContactModel } from './contact.model';
import { DocumentModel } from './document.model';
import { LanguageEnum } from '../enum/language.enum';
import { Dictionary } from '../class/dictionary';

export class WebsiteModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'brokers',
    'documents',
  ];

  /**
   * Website ID
   */
  id: string = '';

  /**
   * Website URL
   */
  url: string = '';

  /**
   * Preview URL
   */
  previewURL: string = '';

  /**
   * Sale iframe URL
   */
  iframeSaleURL: string = '';

  /**
   * Rent iframe URL
   */
  iframeRentURL: string = '';

  /**
   * IP address
   */
  ipAddress: string = '';

  /**
   * Private API key
   */
  privateAPIKey: string = '';

  /**
   * Public API key
   */
  publicAPIKey: string = '';

  /**
   * Alternative domain
   */
  alternativeDomain: string = '';

  /**
   * Facebook app ID
   */
  facebookAppId: string = '';

  /**
   * Google analytics app ID
   */
  googleAnalyticsAppId: string = '';

  /**
   * Layout ID
   */
  layoutId: string = '';

  /**
   * Layout label
   */
  layoutLabel: string = '';

  /**
   * Template ID
   */
  templateId: string = '';

  /**
   * Template label
   */
  templateLabel: string = '';

  /**
   * Default language ID
   */
  defaultLanguageId: LanguageEnum = LanguageEnum.en;

  /**
   * Default language label
   */
  defaultLanguageLabel: string = '';

  /**
   * Available language IDs
   */
  availableLanguageIds: LanguageEnum[] = [LanguageEnum.en];

  /**
   * Available language labels
   */
  availableLanguageLabels: string[] = [];

  /**
   * Brokers
   */
  brokers: ContactModel[] = [];

  /**
   * Is it an active website?
   */
  isActive: boolean = false;

  /**
   * Is fisher active on the website?
   */
  isActiveFisher: boolean = false;

  /**
   * Powered by Realforce?
   */
  isInternal: boolean = false;

  /**
   * Home page content
   */
  homePageContent: Dictionary<WebsiteContentModel> = {};

  /**
   * Documents
   */
  documents: DocumentModel[] = [];

  /**
   * Website styles
   */
  styleSiteBgColour: string = '';
  styleBlockBgColour: string = '';
  stylePrimaryBgColour: string = '';
  stylePrimaryBgFlatColour: string = '';
  styleSecondaryBgColour: string = '';
  styleFooterBgColour: string = '';
  stylePrimaryFontColour: string =  '';
  styleSecondaryFontColour: string = '';
  styleHeaderFooterFontColour: string = '';
  styleDetailsTitleBgColour: string = '';
  styleDetailsTitleBgShadowColour: string = '';
  styleDetailsAmenitiesFontColour: string = '';
  styleDetailsTopBarColour: string = '';
}
