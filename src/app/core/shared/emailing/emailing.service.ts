import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { EmailingModel } from '../../../shared/model/emailing.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { EmailingApiService } from '../../../api/shared/emailing/emailing-api.service';
import { StateInterface } from '../../../core-store/state.interface';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { DocumentModel } from '../../../shared/model/document.model';
import { selectUiDocuments, selectUiPreview, selectUiSummaries } from '../../../core-store/ui-emailing/selectors';
import { EmailingSendResponseInterface } from '../../../api/shared/emailing/emailing-send-response.interface';
import { EmailingConfigurationInterface } from '../../../shared/interface/emailing-configuration.interface';
import { RecipientSummaryInterface } from '../../../shared/interface/recipient-summary.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { EmailingEventSummaryClose } from '../../../core-store/ui-emailing/actions/emailing-event-summary-close';
import { Dictionary } from '../../../shared/class/dictionary';
import { EmailingPreviewInterface } from '../../../shared/interface/emailing-preview.interface';
import { EmailingPreviewDataInterface } from '../../../shared/interface/emailing-preview-data.interface';
import { EmailingUpdatePreview } from '../../../core-store/ui-emailing/actions/emailing-update-preview';

@Injectable()
export class EmailingService extends ModelServiceAbstract<EmailingModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private emailingApiService: EmailingApiService,
  ) {

    super();
  }

  /**
   * Select documents
   */
  selectDocuments(): Observable<KeyValueType<EntityEnum, Dictionary<DocumentModel[]>>> {

    return this.store$.select(selectUiDocuments);
  }

  /**
   * Select summaries
   */
  selectSummaries(): Observable<RecipientSummaryInterface[]> {

    return this.store$.select(selectUiSummaries);
  }

  /**
   * Select preview
   */
  selectPreview(): Observable<EmailingPreviewInterface> {

    return this.store$.select(selectUiPreview);
  }

  /**
   * @inheritDoc
   */
  factory(): EmailingModel {

    return new EmailingModel();
  }

  /**
   * Returns default reminder date
   */
  getDefaultReminderDate(): Date {

    let reminderDate: Date;
    const today: Date = new Date();
    const businessDaysToAdd = 3;
    let count = 0;

    while (count < businessDaysToAdd) {

      // Add one day
      reminderDate = new Date(today.setDate(today.getDate() + 1));

      // Sunday or Saturday
      if (reminderDate.getDay() === 0 || reminderDate.getDay() === 6) {

        return;
      }

      count++;
    }

    return reminderDate;
  }

  /**
   * Email creation configuration
   */
  configuration(
    leadIds: string[],
    replyTo: string,
    replyMode: string,
  ): Observable<EmailingConfigurationInterface> {

    return this.emailingApiService.configuration(leadIds, replyTo, replyMode);
  }

  /**
   * Submit model and return an observable of summaries
   */
  send(model: EmailingModel): Observable<RecipientSummaryInterface[]> {

    const apiCalls: Array<() => Observable<EmailingSendResponseInterface>> = [];
    const recipientSummary: RecipientSummaryInterface[] = [];
    const recipients = [ ...model.recipients, ...model.recipientsCC ];

    // For each languages that the selected contacts speak
    model.contactLanguages.forEach(language => {

      apiCalls.push(() => this.emailingApiService.send(model, language));
    });

    // Combine all API calls into a single observable
    return forkJoin(
      apiCalls.map(apiCall => apiCall()),
    ).pipe(map(responses => {

      // For each response
      responses.forEach((response, index) => {

        const languageId = model.contactLanguages[index];

        // Recipients who either speak the language or use the default language
        const langRecipients = recipients.filter(
          contact => contact.languageId === languageId || (!contact.languageId && languageId === model.defaultLanguageId),
        );

        langRecipients.forEach(recipient => {

          let error = '';
          const newRecipient = recipient.clone<ContactModel>();
          newRecipient.languageId = newRecipient.languageId || model.defaultLanguageId;

          if (!response) {

            error = 'label_email_send_fail';
          }

          // Error
          if (response && response.success !== true) {

            // BE sends email address as a key in validation object
            const isInvalidEmail = Object.keys(response.validation || {}).some(key => key.indexOf(recipient.getMainEmailAddress()) > -1);

            error = isInvalidEmail ? 'label_contact_email_not_found' : 'label_email_send_fail';
          }

          recipientSummary.push({
            model: newRecipient,
            error: error,
          });
        });
      });

      return recipientSummary;
    }));
  }

  /**
   * Close sumary modal
   */
  closeSummary(): void {

    this.store$.dispatch(new EmailingEventSummaryClose({}));
  }

  /**
   * Close preview modal
   */
  closePreview(): void {

    this.store$.dispatch(new EmailingUpdatePreview({
      preview: {
        isOpen: false,
        data: {},
      },
    }));
  }

  /**
   * Return email previews for each contact language
   */
  loadPreviews(model: EmailingModel): Observable<KeyValueType<string, EmailingPreviewDataInterface>> {

    const previews = {};

    if (model.contactLanguages.length === 0) {

      return of(previews);
    }

    model.contactLanguages.forEach(language => previews[language] = this.emailingApiService.loadPreview(model, language));

    return forkJoin(previews);
  }
}
