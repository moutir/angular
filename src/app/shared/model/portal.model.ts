import { ModelAbstract } from '../class/model.abstract';
import { AgencyModel } from './agency.model';
import { PortalEnum } from '../enum/portal.enum';

export class PortalModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'agency',
  ];

  id: string = '';
  name: string = '';
  label: string = '';
  type: string = '';
  portalId: PortalEnum = null;
  agencyWebsiteId: string = '';
  agencyPortalId: string = '';
  isActivePortal: boolean = true;
  index: number = 0;
  language: string = '';
  languageCode: string = '';
  lastExecutionStartDate: Date | null = null;
  lastExecutionEndDate: Date | null = null;
  lastMessage: string = '';
  lastStatus: number = 0;
  maxPictures: number = 0;
  defaultMaxPictures: number = 0;
  isActiveTransfer: boolean = false;
  feedPreview: string = '';
  sendEmptyFile: boolean = false;
  sendLeadCopy: string = '1';
  sendLeadCopySales: boolean = true;
  sendLeadCopyRentals: boolean = true;
  sendBrokerPhone: boolean = false;
  topListing: boolean = false;
  sender: string = '';
  isWithCredentials: boolean = false;
  publicationSites: string = ''; // Publication sites separated by comma
  imageToBeTransfered: number = 0;
  agency: AgencyModel = new AgencyModel();

  // FTP fields
  ftpHost: string = '';
  ftpPort: string = '';
  ftpLogin: string = '';
  ftpPassword: string = '';
  ftpTimeout: string = '';
  ftpAttempts: string = '';
  ftpPasv: string = '';
  ftpDataFolder: string = '';
  ftpImagesFolder: string = '';
  ftpMoviesFolder: string = '';
  ftpDocsFolder: string = '';
  ftpIsActive: boolean = true;

  // Marketing expense fields
  isActiveMarketingExpense: boolean = false;
  marketingPrice: number = 0;
  marketingMonthly: number = 0;
}
