import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { EmailingModel } from '../../../shared/model/emailing.model';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { EmailingSendRequestInterface } from './emailing-send-request.interface';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { DocumentModel } from '../../../shared/model/document.model';
import { EmailingSendResponseInterface } from './emailing-send-response.interface';
import { HelperService } from '../../../core/shared/helper.service';
import { EmailingConfigurationResponseInterface } from './emailing-configuration-response.interface';
import { EmailingConfigurationRequestInterface } from './emailing-configuration-request.interface';
import { EmailingConfigurationInterface } from '../../../shared/interface/emailing-configuration.interface';
import { EmailingPreviewRequestInterface } from './emailing-preview-request.interface';
import { EmailingPreviewInterface } from '../../../shared/interface/emailing-preview.interface';

@Injectable()
export class EmailingApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * Returns email creation configuration response
   */
  configuration(
    leadIds: string[],
    replyTo: string,
    replyMode: string,
  ): Observable<EmailingConfigurationInterface> {

    return this
      .httpService
      .get<EmailingConfigurationRequestInterface, EmailingConfigurationResponseInterface>(
        ApiEndpointEnum.emailingConfiguration,
        this.configurationRequest(leadIds, replyTo, replyMode),
        null,
        true,
      ).pipe(
        map(response => this.configurationResponse(response)),
      );
  }

  /**
   * Send email to the recipients
   */
  send(model: EmailingModel, language: LanguageEnum): Observable<EmailingSendResponseInterface> {

    return this
      .httpService
      .post<EmailingSendRequestInterface, EmailingSendResponseInterface>(
        ApiEndpointEnum.emailingSend,
        this.sendRequest(model, language),
        null,
        true,
      );
  }

  /**
   * Load email preview
   */
  loadPreview(model: EmailingModel, language: string): Observable<EmailingPreviewInterface> {

    return this
      .httpService
      .post<EmailingPreviewRequestInterface, EmailingPreviewInterface>(
        ApiEndpointEnum.emailingTemplate,
        {
          language: language,
          hide_price: model.isPriceHidden ? 1 : 0,
          subject: model.content[language].subject,
          message: model.content[language].message,
          properties: model.properties.map(property => property.id),
          promotions: model.promotions.map(promotion => promotion.id),
        },
        {
          templateId: model.emailTemplateId,
          language: language,
        },
        true,
      );
  }

  /**
   * Handle a configuration() request parameters and return a formatted request
   */
  private configurationRequest(
    leadIds: string[],
    replyTo: string,
    replyMode: string,
  ): EmailingConfigurationRequestInterface {

    const request: EmailingConfigurationRequestInterface = <EmailingConfigurationRequestInterface>{};

    if (leadIds.length > 0) {

      request.lead_id = leadIds;
    }

    if (replyTo) {

      request.in_reply_to = replyTo;
    }

    if (replyMode) {

      request.reply_mode = replyMode;
    }

    return request;
  }

  /**
   * Handle a send() request parameters and return a formatted request
   */
  private sendRequest(model: EmailingModel, language: LanguageEnum): EmailingSendRequestInterface {

    let recipients = model.recipients
      .filter(contact => contact.languageId === language || (!contact.languageId && language === model.defaultLanguageId));
    let recipientsCC = model.recipientsCC
      .filter(contact => contact.languageId === language || (!contact.languageId && language === model.defaultLanguageId));
    let documents: DocumentModel[] = [];

    // Recipients are required for each request
    if (recipients.length === 0 && recipientsCC.length > 0) {

      recipients = recipientsCC;
      recipientsCC = [];
    }

    // Documents
    Object.values(model.documents).forEach(docs => {

      documents = [ ...documents, ...docs ];
    });

    const request: EmailingSendRequestInterface = <EmailingSendRequestInterface>{
      language: language,
      sender_id: model.sender.id,
      promotions: model.promotions.map(p => p.id),
      properties: model.properties.map(p => p.id),
      email_ready_made_content: model.emailContentId,
      in_reply_to: model.replyTo || '',
      copy_to_sender: model.isCopiedToSender ? '1' : '0',
      copy_to_related_brokers: model.isCopiedToBrokers ? '1' : '0',
      hide_price: model.isPriceHidden ? '1' : '0',
      reminder: model.isReminderAdded ? '1' : '0',
      attachments: documents.map(doc => doc.id),
      brochure_type: model.emailBrochureTypeId,
      brochure_template: model.emailBrochurePrivacyId,
      email_template: model.emailTemplateId,
      subject: model.content[language] && model.content[language].subject,
      message: model.content[language] && model.content[language].message,
      contact_id: [],
      agency_id: [],
      firstname: [],
      lastname: [],
      email: [],
      cc_contact_id: [],
      cc_agency_id: [],
      cc_firstname: [],
      cc_lastname: [],
      cc_email: [],
    };

    // Recipients
    recipients.forEach(contact => {

      request.contact_id = [ ...request.contact_id, contact.id ];
      request.agency_id = [ ...request.agency_id, contact.agency.id ];
      request.firstname = [ ...request.firstname, (contact.firstName || '') ];
      request.lastname = [ ...request.lastname, (contact.lastName || '') ];
      request.email = [ ...request.email, (contact.getMainEmailAddress() || '') ];
    });

    // Recipients CC
    recipientsCC.forEach(contact => {

      request.cc_contact_id = [ ...request.cc_contact_id, contact.id ];
      request.cc_agency_id = [ ...request.cc_agency_id, contact.agency.id ];
      request.cc_firstname = [ ...request.cc_firstname, (contact.firstName || '') ];
      request.cc_lastname = [ ...request.cc_lastname, (contact.lastName || '') ];
      request.cc_email = [ ...request.cc_email, (contact.getMainEmailAddress() || '') ];
    });

    // Reminder
    if (model.isReminderAdded) {

      request.reminder_contact_id = [model.reminderContact.id];
      request.reminder_agency_id = [model.reminderContact.agency.id];
      request.reminder_email = [model.reminderContact.getMainEmailAddress() || ''];
      request.reminder_firstname = [model.reminderContact.firstName];
      request.reminder_lastname = [model.reminderContact.lastName];
      request.reminder_date = this.helperService.dateToString(model.reminderDate);
      request.reminder_time = model.reminderTime;
    }

    // Lead
    if (model.isManageLeadByEmail) {

      request.lead_id = model.leadIds;
      request.close_the_lead = model.isLeadClosed ? '1' : '0';
    }

    // Brochure broker
    if (model.brochureBrokerId) {

      request.brochure_broker_id = model.brochureBrokerId;
    }

    return request;
  }

  /**
   * Handle a configuration() response and return EmailingConfigurationInterface
   */
  private configurationResponse(response: EmailingConfigurationResponseInterface): EmailingConfigurationInterface {

    const configResponse: EmailingConfigurationInterface = {
      subject: response.subject,
      message: response.message,
      replyTo: response.in_reply_to,
      leadIds: response.lead_ids,
      isManageLeadByEmail: response.manage_lead_by_email,
      recipients: [],
    };

    (response.recipients || []).forEach(recipient => {

      configResponse.recipients.push({
        id: recipient.contact_id,
        firstName: recipient.firstname,
        lastName: recipient.lastname,
        agencyId: recipient.agency_id,
        email: recipient.email,
        languageId: recipient.language_id,
        type: recipient.type,
      });
    });

    return configResponse;
  }
}
