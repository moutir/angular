import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LeadModel } from '../../shared/model/lead.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { LeadPageService } from '../../core/shared/lead/lead-page.service';
import { LeadOptionsInterface } from '../../shared/interface/lead-options.interface';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageTypeEnum } from '../../shared/enum/page-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { LeadService } from '../../core/shared/lead/lead.service';

@Component({
  selector: 'app-lead-page-read',
  templateUrl: './lead-page-read.component.html',
  styleUrls: ['./lead-page-read.component.scss'],
})
export class LeadPageReadComponent extends PageReadComponentAbstract<
  LeadModel,
  LeadOptionsInterface
> implements OnInit {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.leadReadGeneral;
  readonly PAGE_TAB_EMAIL: PageTabEnum = PageTabEnum.leadReadEmail;

  /**
   * Lead sub source label
   */
  subSourceLabel: string = '';

  /**
   * Iframe URL
   */
  iframeUrl: SafeResourceUrl|null = null;

  /**
   * Auto assign explanations
   */
  autoAssignExplanations: string = '';

  /**
   * Constructor
   */
  constructor(
    protected pageService: LeadPageService,
    protected activatedRoute: ActivatedRoute,
    private trackerService: TrackerService,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private leadService: LeadService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    super.ngOnInit();

    if (this.model.id) {

      // Stats
      this.trackerService.trackString(TrackingActionEnum.leadView, this.model.id);
    }
  }

  /**
   * Clicked on requester contact
   */
  onClickRequesterContact(): void {

    if (this.model.isNeedValidation !== true) {

      return;
    }

    this.leadService.toggleValidation(true);
    this.pageService.redirect(PageTypeEnum.write, this.model.id);
  }

  /**
   * Clicked on contact validation button
   */
  onClickValidate(): void {

    this.leadService.toggleValidation(true);
    this.pageService.redirect(PageTypeEnum.write, this.model.id);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    // Options
    this.subscriptions.push(
      this.pageService.selectOptions().subscribe(options => {

        const subSourceOption = options.subSource.find(option => String(option.value) === this.model.subSourceId);

        this.subSourceLabel = subSourceOption ? subSourceOption.text : '';
      }),
    );
  }

  /**
   * @inheritDoc
   */
  protected onNextModel(model: LeadModel): void {

    super.onNextModel(model);

    if (this.iframeUrl === null && model.id && model.originalMessage) {

      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/lead/original-message/' + model.id);
    }

    this.autoAssignExplanations = '';

    if (!!model.autoAssignCaseNumber) {

      this.autoAssignExplanations = this.translateService
        .instant('label_auto_assign_' + model.autoAssignCaseNumber)
        .split('|')
        .map(explanation => '• ' + explanation)
        .join('\n');
    }
  }
}
