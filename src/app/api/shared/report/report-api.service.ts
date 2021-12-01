import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HelperService } from '../../../core/shared/helper.service';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { ReportModel } from '../../../shared/model/report.model';
import { ReportListRequestInterface } from './report-list-request.interface';
import { ReportListResponseInterface } from './report-list-response.interface';
import { ContactTypeEnum } from '../../../shared/enum/contact-type.enum';
import { ReportSearchModel } from '../../../shared/model/report-search.model';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { ReportSendEmailResponseInterface } from './report-send-email-response.interface';
import { ReportSendEmailInterface } from '../../../shared/interface/report-send-email.interface';
import { ReportSendEmailRequestInterface } from './report-send-email-request.interface';
import { ReportGenerationInterface } from '../../../shared/interface/report-generation.interface';
import { ReportGenerationModel } from '../../../shared/model/report-generation.model';
import { ReportLoadConfigurationResponseInterface } from './report-load-configuration-response.interface';
import { ReportScheduleResponseInterface } from './report-schedule-response.interface';
import { ReportTypeEnum } from '../../../shared/enum/report-type.enum';
import { ReportScheduleRequestInterface } from './report-schedule-request.interface';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';

@Injectable()
export class ReportApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List reports
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ReportSearchModel,
  ): Observable<ModelListInterface<ReportModel>> {

    return this
      .httpService
      .get<ReportListRequestInterface, ReportListResponseInterface>(
        ApiEndpointEnum.reportList,
        this.listRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * Send reports by email
   */
  sendEmail(
    send: ReportSendEmailInterface,
    generation?: ReportGenerationInterface,
  ): Observable<ReportSendEmailResponseInterface> {

    return this
      .httpService
      .post<string, ReportSendEmailResponseInterface>(
        ApiEndpointEnum.reportSendMail,
        this.sendEmailRequest(send, generation),
        null,
        true,
      )
      ;
  }

  /**
   * Load report generation configuration
   */
  configuration(type: string): Observable<ReportGenerationModel|null> {

    const types = {
      owner: 'landlord',
    };

    return this
      .httpService
      .get<null, ReportLoadConfigurationResponseInterface>(
        ApiEndpointEnum.reportLoadConfiguration,
        null,
        { type: types[type] },
      ).pipe(
        map(response => this.configurationResponse(response)),
      )
      ;
  }

  /**
   * Report Schedule
   */
  schedule(generation: ReportGenerationInterface): Observable<ReportScheduleResponseInterface> {

    return this
      .httpService
      .post<string, ReportScheduleResponseInterface>(
        ApiEndpointEnum.reportSchedule,
        this.scheduleRequest(generation),
        null,
        true,
      )
      ;
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ReportSearchModel,
  ): ReportListRequestInterface {

    const request = <ReportListRequestInterface>{
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    const reportTypes = {
      owner: ContactTypeEnum.owner,
      buyer: ContactTypeEnum.buyer,
      tenant: ContactTypeEnum.tenant,
      intermediary: ContactTypeEnum.intermediary,
      developer: ContactTypeEnum.developer,
    };

    if (filters.reportType) {

      request.type = reportTypes[filters.reportType];
    }

    if (filters.clientIds && filters.clientIds.length > 0) {

      request.contact = filters.clientIds;
    }

    if (filters.brokerIds && filters.brokerIds.length > 0) {

      request.broker = filters.brokerIds;
    }

    if (filters.dateFrom) {

      request.start_date = this.helperService.dateToString(new Date(filters.dateFrom));
    }

    if (filters.dateTo) {

      request.end_date = this.helperService.dateToString(new Date(filters.dateTo));
    }

    // Property, property type and schedule type are available for owner report only
    if (request.type !== ContactTypeEnum.owner) {

      return request;
    }

    if (filters.propertyIds && filters.propertyIds.length > 0) {

      request.property = filters.propertyIds;
    }

    if (filters.propertyTypeId) {

      request.property_type = filters.propertyTypeId;
    }

    if (filters.scheduleId) {

      request.scheduling = filters.scheduleId;
    }

    return request;
  }

  /**
   * Handle a list() response and return a list of report models
   */
  private listResponse(response: ReportListResponseInterface): ModelListInterface<ReportModel> {

    return {
      models: response.data.map((data, i) => {

        const report = new ReportModel();

        report.id = data.id;
        report.hasEmail = !!data.email_exists;
        report.clientBrokerId = data.main_contact_id || data.client_broker_id;
        report.visitPlannedCount = Number(String(data.number_of_visits_planned || '').split('<br />')[0]) || 0;
        report.visitDoneCount = Number(String(data.number_of_visits_done || '').split('<br />')[0]) || 0;
        report.propositionCount = Number(String(data.number_of_propositions || data.number_of_listings_sent || '').split('<br />')[0]) || 0;

        // Property
        if (data.property_id) {

          report.property.id = data.property_id;
          report.property.reference = data.property_reference || '';
          report.property.photoSmallURL = data.property_info.photo_url || '';
          report.property.photoLargeURL = data.property_info.photo_url || '';
          report.property.labelPrice = data.property_info.price || '';
          report.property.location.label = data.property_address || '';
          report.property.bathrooms = data.property_info.bathrooms || '';
          report.property.bedrooms = data.property_info.bedrooms || '';
          report.property.rooms = data.property_info.rooms || '';
          report.property.areaLiving = data.property_info.habitable || '';
          report.property.areaWeighted = data.property_info.weighted;
          report.property.areaLand = data.property_info.land;
          report.property.labelSubcategory = data.property_info.subcategory;
          report.property.ranking = parseInt(data.property_info.ranking, 10);
          report.property.broker.id = data.property_info.property_broker.id;
          report.property.broker.fullName = data.property_info.property_broker.full_name;

          if (data.property_info.city) {

            report.property.location.levels.push(data.property_info.city);
          }

          if (data.property_info.canton) {

            report.property.location.levels.push(data.property_info.canton);
          }
        }

        // Promotion
        if (data.promotion_id) {

          report.promotion.id = data.promotion_id;
          report.promotion.name = data.promotion_name || '';
          report.promotion.photoSmallURL = data.promotion.photo_url || '';
          report.promotion.photoLargeURL = data.promotion.photo_url || '';
          report.promotion.location.label = data.promotion_address || '';
          report.promotion.propertyPriceFrom = data.promotion.price_from;
          report.promotion.propertyTotalCount = data.promotion.number_of_properties;
          report.promotion.propertyReservedCount = data.promotion.number_of_properties_reserved;
          report.promotion.propertySoldCount = data.promotion.number_of_properties_sold;
          report.promotion.broker.id = data.promotion.promotion_broker ? data.promotion.promotion_broker.id : '';
          report.promotion.broker.fullName = data.promotion.promotion_broker ? data.promotion.promotion_broker.full_name : '';
          report.promotion.propertyBedroomsFrom = parseInt(data.promotion.bedrooms_from, 10) || 0;
          report.promotion.propertyBedroomsTo = parseInt(data.promotion.bedrooms_to, 10) || 0;
          report.promotion.propertyAreaLivingFrom = parseInt(data.promotion.habitable_from, 10) || 0;
          report.promotion.propertyAreaLivingTo = parseInt(data.promotion.habitable_to, 10) || 0;
          report.promotion.propertyAreaWeightedFrom = parseInt(data.promotion.weighted_from, 10) || 0;
          report.promotion.propertyAreaWeightedTo = parseInt(data.promotion.weighted_to, 10) || 0;
        }

        // Client
        if (data.name) {

          report.contact.id = data.name.id;
          report.contact.fullName = (data.name.name || '').trim();
          report.contact.photoURL = data.contact_info && data.contact_info.photo_url || '';
          report.contact.ranking = data.contact_info && parseInt(data.contact_info.ranking, 10);

          if (data.contact_info && data.contact_info.email) {

            report.contact.emails[0] = new ContactEmailModel();
            report.contact.emails[0].emailId = data.contact_info.email;
          }
        }

        // Brokers
        (data.brokers || []).map(b => {

          const broker = new ContactModel();
          broker.id = b.id;
          broker.fullName = (b.name || '').trim();

          report.brokers.push(broker);
        });

        // Report generation data
        if (data.scheduler) {

          report.generation = new ReportGenerationModel();

          report.generation.attribute = data.scheduler.attribute;
          report.generation.broker = data.scheduler.broker;
          report.generation.clones = data.scheduler.clones;
          report.generation.communications = data.scheduler.communications;
          report.generation.dateRange = data.scheduler.date_range;
          report.generation.startDate = this.helperService.stringToDate(data.scheduler.start_datetime);
          report.generation.endDate = this.helperService.stringToDate(data.scheduler.end_datetime);
          report.generation.frequency = data.scheduler.frequency;
          report.generation.informations = data.scheduler.informations;
          report.generation.language = <LanguageEnum>data.scheduler.lang;
          report.generation.leads = data.scheduler.leads;
          report.generation.marketingExpenses = data.scheduler.marketing_expenses;
          report.generation.nextVisits = data.scheduler.next_visits;
          report.generation.offers = data.scheduler.offers;
          report.generation.pastVisits = data.scheduler.past_visits;
          report.generation.price = data.scheduler.price;
          report.generation.reportSenderContactId = data.scheduler.report_sender_contact_id;
          report.generation.sending = data.scheduler.sending;
          report.generation.summary = data.scheduler.summary;
          report.generation.time = data.scheduler.time;
          report.generation.isSchedulerEnabled = !!data.scheduler.enabled;
          report.generation.isHideIntermediaryTask = data.scheduler.hide_intermediary_task === '1';
        }

        return report;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Handle a sendEmail() request parameters and return a formatted request
   */
  private sendEmailRequest(send: ReportSendEmailInterface, generation?: ReportGenerationInterface): string {

    const reportType = (send.type === 'owner' || send.type === 'developer') ?
      ['report', send.type].join('_').replace('owner', 'landlord') : 'full_report_client';

    return JSON.stringify(send.reports.map(report => {

      let request = <ReportSendEmailRequestInterface>{
        type: reportType,
        lang: send.language,
        from: send.dateFrom ? this.helperService.dateToString(send.dateFrom) : '',
        to: send.dateTo ? this.helperService.dateToString(send.dateTo) : '',
        report_id: report.id,
      };

      if (report.contact.id) {

        request.contact_id = report.contact.id;
      }

      if (report.property.id) {

        request.property_id = report.property.id;
      }

      if (report.promotion.id) {

        request.promotion_id = report.promotion.id;
      }

      if (send.type === ReportTypeEnum.owner) {

        return {
          ...request,
          informations: generation.model.informations,
          broker: generation.model.broker,
          price: generation.model.price,
          leads: generation.model.leads,
          time: generation.model.time,
          sending: generation.model.sending,
          past_visits: generation.model.pastVisits,
          next_visits: generation.model.nextVisits,
          marketing_expenses: generation.model.marketingExpenses,
          summary: generation.model.summary,
          offers: generation.model.offers,
          communications: generation.model.communications,
          hide_intermediary_task: (generation.model.isHideIntermediaryTask ? '1' : '0'),
        };
      }

      request = {
        ...request,
        email_exists: report.hasEmail,
        name: report.contact.fullName,
        property: report.property.reference,
      };

      return request;
    }));
  }

  /**
   * Handle a schedule() request parameters and return a formatted request
   */
  private scheduleRequest(generation: ReportGenerationInterface): string {

    const types = {
      owner: 'report_landlord',
    };

    return JSON.stringify(<ReportScheduleRequestInterface>[{
      type: types[generation.reportType],
      property_id: generation.propertyId,
      contact_id: generation.contactId,
      lang: generation.language,
      from: (generation.reportDateFrom ? this.helperService.dateToString(generation.reportDateFrom) : ''),
      to: (generation.reportDateTo ? this.helperService.dateToString(generation.reportDateTo) : ''),
      schedule_frequency: generation.model.frequency,
      date_range: generation.model.dateRange,
      schedule_start: (generation.model.startDate ? this.helperService.dateToString(generation.model.startDate) : ''),
      schedule_end: (generation.model.endDate ? this.helperService.dateToString(generation.model.endDate) : ''),
      clone_for_other_owners: generation.model.isAppliedToOthers ? '1' : '0',
      enable_schedule: generation.isActionActivate ? '1' : '0',
      informations: generation.model.informations,
      broker: generation.model.broker,
      price: generation.model.price,
      leads: generation.model.leads,
      time: generation.model.time,
      sending: generation.model.sending,
      past_visits: generation.model.pastVisits,
      next_visits: generation.model.nextVisits,
      marketing_expenses: generation.model.marketingExpenses,
      summary: generation.model.summary,
      offers: generation.model.offers,
      communications: generation.model.communications,
      hide_intermediary_task: (generation.model.isHideIntermediaryTask ? '1' : '0'),
    }]);
  }

  /**
   * Handle a configuration() response and return report generation model
   */
  private configurationResponse(response: ReportLoadConfigurationResponseInterface): ReportGenerationModel|null {

    if (!response || response.success === false) {

      return null;
    }

    const model = new ReportGenerationModel();

    model.informations = response.configuration.informations;
    model.broker = response.configuration.broker;
    model.price = response.configuration.price;
    model.leads = response.configuration.leads;
    model.time = response.configuration.time;
    model.sending = response.configuration.sending;
    model.pastVisits = response.configuration.past_visits;
    model.nextVisits = response.configuration.next_visits;
    model.marketingExpenses = response.configuration.marketing_expenses;
    model.summary = response.configuration.summary;
    model.offers = response.configuration.offers || '2';
    model.communications = response.configuration.communications || '3';
    model.frequency = response.configuration.frequency || 'weekly';
    model.dateRange = response.configuration.date_range || 'last_week';

    return model;
  }
}
