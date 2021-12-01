import { Injectable } from '@angular/core';

import { BrowserService } from './browser/browser.service';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { TrackerService } from './tracker/tracker.service';
import { PropertyService } from './property/property.service';
import { PropertySearchlistService } from './property/property-searchlist.service';
import { LeadSearchlistService } from './lead/lead-searchlist.service';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PromotionSearchlistService } from './promotion/promotion-searchlist.service';
import { TaskSearchlistService } from './task/task-searchlist.service';
import { ContactService } from './contact/contact.service';
import { ContactSearchlistService } from './contact/contact-searchlist.service';
import { ReportSearchlistService } from './report/report-searchlist.service';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { MarketingExpenseSearchlistService } from './marketing-expense/marketing-expense-searchlist.service';
import { ContactSearchMapService } from '../../contact-search/shared/contact-search-map.service';
import { ClipboardService } from '../../clipboard/shared/clipboard.service';
import { EmailService } from './email/email.service';
import { RestrictionService } from './restriction/restriction.service';

/**
 * @deprecated TODO[later] Remove once fully on Angular
 */
@Injectable()
export class LegacyService {

  // Empty template for legacy routes handled by PHP
  constructor(
    private browserService: BrowserService,
    private runtimeService: RuntimeService,
    private trackerService: TrackerService,
    private propertyService: PropertyService,
    private propertySearchlistService: PropertySearchlistService,
    private leadSearchlistService: LeadSearchlistService,
    private promotionSearchlistService: PromotionSearchlistService,
    private taskSearchlistService: TaskSearchlistService,
    private contactService: ContactService,
    private contactSearchlistService: ContactSearchlistService,
    private reportSearchlistService: ReportSearchlistService,
    private marketingExpenseSearchlistService: MarketingExpenseSearchlistService,
    private contactSearchMapService: ContactSearchMapService,
    private clipboardService: ClipboardService,
    private emailService: EmailService,
    private restrictionService: RestrictionService,
  ) {

  }

  /**
   * Expose Angular services to legacy javascript
   */
  expose(): void {

    this.browserService.getWindow().rfFeature = (name: keyof RuntimeFeatureInterface): void => this.runtimeService.toggleFeature(name);
    this.browserService.getWindow().rfTrackerService = this.trackerService;
    this.browserService.getWindow().rfNotification = (
      type: NotificationTypeEnum,
      message: string,
    ) => this.runtimeService.notification(type, message);
    this.browserService.getWindow().rfPropertyService = this.propertyService;
    this.browserService.getWindow().rfPropertySearchlistService = this.propertySearchlistService;
    this.browserService.getWindow().rfLeadSearchlistService = this.leadSearchlistService;
    this.browserService.getWindow().rfPromotionSearchlistService = this.promotionSearchlistService;
    this.browserService.getWindow().rfTaskSearchlistService = this.taskSearchlistService;
    this.browserService.getWindow().rfContactService = this.contactService;
    this.browserService.getWindow().rfContactSearchlistService = this.contactSearchlistService;
    this.browserService.getWindow().rfReportSearchlistService = this.reportSearchlistService;
    this.browserService.getWindow().rfMarketingExpenseSearchlistService = this.marketingExpenseSearchlistService;
    this.browserService.getWindow().rfContactSearchMapService = this.contactSearchMapService;
    this.browserService.getWindow().rfClipboardService = this.clipboardService;
    this.browserService.getWindow().rfEmailService = this.emailService;
    this.browserService.getWindow().rfRestrictionService = this.restrictionService;
  }
}
