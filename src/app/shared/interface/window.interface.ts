import { RealforceConfigInterface } from './realforce.interface';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { DataLayerInterface } from './data-layer.interface';
import { PropertySearchlistService } from '../../core/shared/property/property-searchlist.service';
import { PropertyService } from '../../core/shared/property/property.service';
import { RuntimeFeatureInterface } from './runtime-feature.interface';
import { LeadSearchlistService } from '../../core/shared/lead/lead-searchlist.service';
import { PromotionSearchlistService } from '../../core/shared/promotion/promotion-searchlist.service';
import { TaskSearchlistService } from '../../core/shared/task/task-searchlist.service';
import { ContactSearchlistService } from '../../core/shared/contact/contact-searchlist.service';
import { ContactService } from '../../core/shared/contact/contact.service';
import { ReportSearchlistService } from '../../core/shared/report/report-searchlist.service';
import { NotificationTypeEnum } from '../enum/notification-type.enum';
import { MarketingExpenseSearchlistService } from '../../core/shared/marketing-expense/marketing-expense-searchlist.service';
import { ContactSearchMapService } from '../../contact-search/shared/contact-search-map.service';
import { ClipboardService } from '../../clipboard/shared/clipboard.service';
import { EmailService } from '../../core/shared/email/email.service';
import { RestrictionService } from '../../core/shared/restriction/restriction.service';

export interface WindowInterface extends Window {

  /**
   * Realforce global variable to pass data from BE to FE
   */
  realforce: {

    /**
     * Configuration per module
     */
    config: RealforceConfigInterface<Object>;

  };

  /**
   * GTM DataLayer
   */
  dataLayer: DataLayerInterface;

  /**
   * Is there any form with dirty fields? TODO[later] remove this once fully on Angular
   */
  hasDirtyForm: boolean;

  /**
   * Expose services to legacy javascript TODO[later] remove this once fully on Angular
   */
  rfInit: () => void;
  rfNotification: (type: NotificationTypeEnum, message: string) => void;
  rfTrackerService: TrackerService;
  rfPropertySearchlistService: PropertySearchlistService;
  rfPropertyService: PropertyService;
  rfLeadSearchlistService: LeadSearchlistService;
  rfPromotionSearchlistService: PromotionSearchlistService;
  rfTaskSearchlistService: TaskSearchlistService;
  rfContactSearchlistService: ContactSearchlistService;
  rfContactService: ContactService;
  rfReportSearchlistService: ReportSearchlistService;
  rfMarketingExpenseSearchlistService: MarketingExpenseSearchlistService;
  rfContactSearchMapService: ContactSearchMapService;
  rfClipboardService: ClipboardService;
  rfEmailService: EmailService;
  rfRestrictionService: RestrictionService;
  rfFeature: (name: keyof RuntimeFeatureInterface) => void;
  rfFisher: () => void;

  /**
   * Defined in legacy code
   */
  showPropertyDetails: Function;
  openPropertyMatchTable: Function;
  getPropertyHistory: Function;
  loadLeadDetails: Function;
  showPromotionDetails: Function;
  getPromotionHistory: Function;
  rfDebounce: Function;
  loadTaskDetails: Function;
  loadContactDetails: Function;
  showContactDetails: Function;
  openContactMatchTable: Function;
  getContactHistory: Function;
  openOwnerReportModal: Function;
  loadMarketingExpenseDetails: Function;
  updateContactSearchPolygons: Function;
}
