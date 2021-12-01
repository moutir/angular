import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { EmailContentModel } from '../../../shared/model/email-content.model';
import { EmailContentResponseInterface } from './email-content-response.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { EmailSearchModel } from '../../../shared/model/email-search.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { EmailModel } from '../../../shared/model/email.model';
import { EmailListResponseInterface } from './email-list-response.interface';
import { EmailListRequestInterface } from './email-list-request.interface';
import { HelperService } from '../../../core/shared/helper.service';
import { EmailRecipientModel } from '../../../shared/model/email-recipient.model';
import { PropertyModel } from '../../../shared/model/property.model';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { ContactPhoneModel } from '../../../shared/model/contact-phone.model';

@Injectable()
export class EmailApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: EmailSearchModel,
  ): Observable<ModelListInterface<EmailModel>> {

    return this
      .httpService
      .get<EmailListRequestInterface, EmailListResponseInterface>(
        ApiEndpointEnum.emailList,
        this.listRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      )
    ;
  }

  /**
   * Load email content
   */
  emailContent(id: string): Observable<EmailContentModel|null> {

    return this
      .httpService
      .get<null, EmailContentResponseInterface>(
        ApiEndpointEnum.emailContent,
        null,
        { id },
      )
      .pipe(
        map(response => this.emailContentResponse(response, id)),
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: EmailSearchModel,
  ): EmailListRequestInterface {

    const request = <EmailListRequestInterface>{
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    if (filters.subject) {

      request.subject = filters.subject;
    }

    if (filters.dateFrom) {

      request.startDate = this.helperService.dateToString(new Date(filters.dateFrom));
    }

    if (filters.dateTo) {

      request.endDate = this.helperService.dateToString(new Date(filters.dateTo));
    }

    if (filters.attachmentTypeId) {

      request.attachments = filters.attachmentTypeId;
    }

    if (filters.contactIds && filters.contactIds.length > 0) {

      request.recipientId = filters.contactIds;
    }

    if (filters.statusIds && filters.statusIds.length > 0) {

      request.delivery = filters.statusIds;
    }

    if (filters.propertyIds && filters.propertyIds.length > 0) {

      request.propertyId = filters.propertyIds;
    }

    if (filters.promotionIds && filters.promotionIds.length > 0) {

      request.promotionId = filters.promotionIds.map(id => 'promotion_' + id);
    }

    if (filters.brokerIds && filters.brokerIds.length > 0) {

      request.senderId = filters.brokerIds;
    }

    if (filters.ids && filters.ids.length > 0) {

      request.ids = filters.ids;
    }

    return request;
  }

  /**
   * Handle a list() response and return a list of email models
   */
  private listResponse(response: EmailListResponseInterface): ModelListInterface<EmailModel> {

    return {
      models: response.data.map((data, i) => {

        const email = new EmailModel();

        email.id = data.id;
        email.subject = data.subject || '';
        email.message = (data.message || '')
          .replace(/<li>/g, '\n - ')
          .replace(/<(br\/?|div|ul|p|h1|h2)>/g, '\n')
          .replace(/<[^>]+>/g, '')
        ;
        email.sender.id = data.sender_id;
        email.sender.firstName = (data.firstname || '').trim();
        email.sender.lastName = (data.lastname || '').trim();
        email.sender.fullName = email.sender.getFullName() || [email.sender.firstName, email.sender.lastName].join(' ');
        email.sentDate = this.helperService.stringToDate(data.sent_datetime);
        email.propertyCount = Number(data.statistics.nb_properties || 0);
        email.promotionCount = Number(data.statistics.nb_promotions || 0);
        email.recipientCount = Number(data.statistics.nb_recipients || 0);
        email.attachmentCount = Number(data.statistics.nb_attachments || 0);
        email.bouncedCount = Number(data.statistics.nb_bounces || 0);
        email.deliveredCount = Number(email.recipientCount - email.bouncedCount - (data.statistics.nb_emails || 0));
        email.openedCount = Number(data.statistics.nb_open || 0);
        email.downloadCount = Number(data.statistics.nb_brochures || 0);

        // Email sent on behalf of another contact
        if (data.real_sender_id) {

          email.realSender.id = data.real_sender_id;
          email.realSender.firstName = (data.real_sender_firstname || '').trim();
          email.realSender.lastName = (data.real_sender_lastname || '').trim();
          email.realSender.fullName = email.realSender.getFullName() || [email.realSender.firstName, email.realSender.lastName].join(' ');
        }

        // Properties
        ((data.statistics && data.statistics.properties) || []).forEach(prop => {

          const property = new PropertyModel();

          property.id = prop.id;
          property.reference = prop.reference;
          property.ranking = parseInt(prop.ranking, 10);
          property.photoSmallURL = prop.photo_thumb;
          property.photoLargeURL = prop.photo_zoom;
          property.labelPrice = prop.price;
          property.rooms = prop.rooms;
          property.bedrooms = prop.bedrooms;
          property.areaLiving = prop.habitable;
          property.areaLand = prop.land;
          property.link = prop.link;
          property.location.label = prop.address;
          property.location.street = (prop.location || []).join(' - ');

          email.properties.push(property);
        });

        // Promotions
        ((data.statistics && data.statistics.promotions) || []).forEach(promo => {

          const promotion = new PromotionModel();

          promotion.id = promo.id;
          promotion.name = promo.name;
          promotion.reference = promo.reference;
          promotion.photoSmallURL = promo.photo_thumb;
          promotion.photoLargeURL = promo.photo_zoom;
          promotion.link = promo.link;
          promotion.address1 = (promo.location || []).join(' - ');
          promotion.location.label = promo.address;

          if (promo.summary) {

            promotion.propertyBedroomsFrom = Number(promo.summary.bedrooms_from) || 0;
            promotion.propertyBedroomsTo = Number(promo.summary.bedrooms_to) || 0;
            promotion.propertyAreaLivingFrom = Number(promo.summary.habitable_from) || 0;
            promotion.propertyAreaLivingTo = Number(promo.summary.habitable_to) || 0;
            promotion.propertyTotalCount = promo.summary.num_of_properties;
            promotion.propertyPrice =  (promo.summary.price || '').toString();
            promotion.propertyPriceFrom = promo.summary.price_from;
            promotion.propertySoldCount = promo.summary.price_sold;
            promotion.propertyReservedCount = promo.summary.reserved;
            promotion.propertySoldCount = promo.summary.sold;
            promotion.propertyAreaWeightedFrom = Number(promo.summary.weighted_from);
            promotion.propertyAreaWeightedTo = Number(promo.summary.weighted_to);
          }

          email.promotions.push(promotion);
        });

        // Recipients
        ((data.statistics && data.statistics.recipients) || []).forEach(r => {

          const recipient = new EmailRecipientModel();

          recipient.id = r.id;
          recipient.firstName = (r.firstname || '').trim();
          recipient.lastName = (r.lastname || '').trim();
          recipient.fullName = recipient.getFullName() || r.email_address || (r.contact && r.contact.email) || '';
          recipient.status = r.status;
          recipient.statusCode = r.status_code;
          recipient.statusDescription = r.status_description;
          recipient.statusDate = this.helperService.stringToDate(r.status_datetime);
          recipient.firstOpenDate = this.helperService.stringToDate(r.first_open_datetime);
          recipient.lastOpenDate = this.helperService.stringToDate(r.last_open_datetime);
          recipient.openCount = r.nb_open;
          recipient.downloadCount = r.nb_downloads;

          if (r.email_address || r.contact && r.contact.email) {

            const em = new ContactEmailModel();
            em.emailId = r.email_address || r.contact.email;

            recipient.emails.push(em);
          }

          if (r.contact) {

            recipient.companyName = r.contact.company || '';
            recipient.link = r.contact.link || '';
            recipient.photoURL = r.contact.photo || '';

            if (r.contact.mobile) {

              const mob = new ContactPhoneModel();
              mob.number = r.contact.mobile;

              recipient.mobiles.push(mob);
            }

            if (r.contact.landline) {

              const ph = new ContactPhoneModel();
              ph.number = r.contact.landline;

              recipient.mobiles.push(ph);

              recipient.landlines.push(ph);
            }
          }

          // Downloaded properties
          (r.downloaded_properties || []).forEach(dp => {

            const property = email.properties.filter(prop => prop.id === dp.id)[0];

            recipient.downloadedProperties.push({
              id: dp.id,
              reference: property && property.reference,
              name: '',
              link: property && property.link,
              photoURL: property && property.photoSmallURL,
              downloadCount: Number(dp.count || 0),
              firstDownloadDate: this.helperService.stringToDate(dp.first_download_datetime),
              lastDownloadDate: this.helperService.stringToDate(dp.last_download_datetime),
            });
          });

          // Downloaded promotions
          (r.downloaded_promotions || []).forEach(dp => {

            const promotion = email.promotions.filter(promo => promo.id === dp.id)[0];

            recipient.downloadedPromotions.push({
              id: dp.id,
              reference: promotion && promotion.reference,
              name: promotion && promotion.name,
              link: promotion && promotion.link,
              photoURL: promotion && promotion.photoSmallURL,
              downloadCount: Number(dp.count || 0),
              firstDownloadDate: this.helperService.stringToDate(dp.first_download_datetime),
              lastDownloadDate: this.helperService.stringToDate(dp.last_download_datetime),
            });
          });

          email.recipients.push(recipient);
        });

        // Attachments
        ((data.statistics && data.statistics.attachments) || []).forEach(attachment => {

          email.attachments.push({
            filename: attachment.filename,
            url: attachment.url,
          });
        });

        return email;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Handle an email content response and return an email content model
   */
  private emailContentResponse(response: EmailContentResponseInterface, id: string): EmailContentModel {

    const emailContent = new EmailContentModel();
    emailContent.id = id;

    Object
      .keys(response)
      .forEach(language => {

        // No subject nor message
        if (
          response[language].subject && response[language].subject.trim() === '' &&
          response[language].message && (response[language].message.trim() === '' || response[language].message.trim() === '<br>')
        ) {

          return;
        }

        emailContent.label[language] = response[language].label;
        emailContent.subject[language] = response[language].subject;
        emailContent.html[language] = response[language].message;
      });

    return emailContent;
  }
}
