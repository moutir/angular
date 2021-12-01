import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BrowserService } from '../browser/browser.service';
import { TrackerService } from '../tracker/tracker.service';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { EmailTemplateModel } from '../../../shared/model/email-template.model';
import { StateInterface } from '../../../core-store/state.interface';
import { selectDataEmailTemplate } from '../../../core-store/data-email-template/selectors';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { EmailTemplateApiService } from '../../../api/shared/email-template/email-template-api.service';
import { EmailTemplateEventRemove } from '../../../core-store/ui-email-template/actions/email-template-event-remove';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { EmailTemplateConfig } from './email-template.config';
import { EmailTemplateSearchModel } from '../../../shared/model/email-template-search.model';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { EmailTemplateLoadResponseInterface } from '../../../api/shared/email-template/email-template-load-response.interface';
import { EmailTemplateContentModel } from '../../../shared/model/email-template-content.model';
import { HelperService } from '../helper.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';

@Injectable()
export class EmailTemplateService extends ModelServiceAbstract<EmailTemplateModel> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected emailTemplateApiService: EmailTemplateApiService,
    protected browserService: BrowserService,
    protected trackerService: TrackerService,
    protected moduleConfig: EmailTemplateConfig,
    private legacyParserService: LegacyParserService,
    private helperService: HelperService,
    private runtimeService: RuntimeService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): EmailTemplateModel {

    return new EmailTemplateModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<EmailTemplateModel|null> {

    return this.store$.select(selectDataEmailTemplate(id));
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: EmailTemplateSearchModel,
  ): Observable<ModelListInterface<EmailTemplateModel>> {

    return this.emailTemplateApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<EmailTemplateModel> {

    return zip(
      this.runtimeService.selectCurrentLanguageId(),
      this.runtimeService.selectAvailableLanguageIds(),
      this.emailTemplateApiService.load(id),
    ).pipe(
        map(([currentLanguage, availableLanguageIds, response]) => {

          const model = this.loadResponse(response, availableLanguageIds);
          const content = model.content[currentLanguage];

          model.id = id;

          if (content) {

            model.label = content.title;
          }

          return model;
        }),
      );
  }

  /**
   * Remove email template
   */
  remove(id: string): void {

    this.store$.dispatch(
      new EmailTemplateEventRemove({ emailTemplateId: id }),
    );
  }

  /**
   * @inheritDoc
   */
  save(model: EmailTemplateModel): Observable<ModelSaveInterface> {

    return zip(
      this.runtimeService.selectAvailableLanguageIds(),
      this.emailTemplateApiService.save(model),
    ).pipe(
      map(([availableLanguageIds, response]) => {

        const validationMapping = {
          ...this.moduleConfig.SAVE_VALIDATION_MAPPING,
        };

        // Mapping for specific language fields
        availableLanguageIds.forEach(lang => {

          validationMapping['title_' + lang] = <keyof EmailTemplateModel>('content_title_' + lang);
          validationMapping['subject_' + lang] = <keyof EmailTemplateModel>('content_subject_' + lang);
          validationMapping['message_' + lang] = <keyof EmailTemplateModel>('content_message_' + lang);
        });

        return this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING);
      }),
      catchError(([availableLanguageIds, response]) => of(
        this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
      )),
    );
  }

  /**
   * Handle a load() response and return an email template model
   */
  private loadResponse(response: EmailTemplateLoadResponseInterface, languageIds: LanguageEnum[]): EmailTemplateModel {

    const model = new EmailTemplateModel();

    model.isShared = response.data.shared === 1;

    model.createDate = this.helperService.stringToDate(response.create_datetime);
    model.updateDate = this.helperService.stringToDate(response.update_datetime);

    // Created contact
    if (response.create_contact) {

      model.createContact.id = response.create_contact.id;
      model.createContact.firstName = response.create_contact.firstname;
      model.createContact.lastName = response.create_contact.lastname;
      model.createContact.initials = response.create_contact.initials;
      model.createContact.fullName = model.createContact.getFullName();
    }

    // Updated contact
    if (response.update_contact) {

      model.updateContact.id = response.update_contact.id;
      model.updateContact.firstName = response.update_contact.firstname;
      model.updateContact.lastName = response.update_contact.lastname;
      model.updateContact.initials = response.update_contact.initials;
      model.updateContact.fullName = model.updateContact.getFullName();
    }

    // Email template content per language
    languageIds.forEach(language => {

      const contentModel = new EmailTemplateContentModel();
      const content = response.data.i18n[language] || {
        label: '',
        subject: '',
        message: '',
      };

      contentModel.title = content.label;
      contentModel.subject = content.subject;
      contentModel.message = content.message;

      model.content[language] = contentModel;
    });

    return model;
  }
}
