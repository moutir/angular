import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { EmailModel } from '../../shared/model/email.model';
import { EmailSearchOptionsInterface } from '../../shared/interface/email-search-options.interface';
import { EmailSearchModel } from '../../shared/model/email-search.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { EmailService } from '../../core/shared/email/email.service';
import { EmailSearchlistService } from '../../core/shared/email/email-searchlist.service';
import { EmailConfig } from '../../core/shared/email/email.config';
import { ModalChoiceInterface } from '../../shared/interface/modal-choice.interface';
import { EmailSummaryInterface } from '../../shared/interface/email-summary.interface';

@Component({
  selector: 'app-email-searchlist',
  templateUrl: './email-searchlist.component.html',
  styleUrls: ['./email-searchlist.component.scss'],
})
export class EmailSearchlistComponent extends SearchlistComponentAbstract<
  EmailModel,
  EmailSearchModel,
  EmailSearchOptionsInterface
> {

  /**
   * State observables
   */
  emailSummary$: Observable<EmailSummaryInterface>;

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: EmailConfig,
    protected searchlistService: EmailSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected emailService: EmailService,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.emailSummary$ = this.emailService.selectSummary();
  }

  /**
   * Submitted modal for email summary
   */
  onSubmitModalSummary(event: ModalChoiceInterface<EmailSummaryInterface>): void {

    return this.emailService.summary(event.data);
  }

  /**
   * @inheritDoc
   */
  onClickModel(model: EmailModel): void {

    this.emailService.page(model);
  }
}
