import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HelperService } from '../../../core/shared/helper.service';
import { TaskSearchModel } from '../../../shared/model/task-search.model';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { TaskModel } from '../../../shared/model/task.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { TaskListRequestInterface } from './task-list-request.interface';
import { TaskListResponseInterface } from './task-list-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { ContactModel } from '../../../shared/model/contact.model';
import { TaskImportanceResponseInterface } from './task-update-importance-response.interface';
import { TaskFinishedResponseInterface } from './task-update-finished-response.interface';
import { TaskFinishedRequestInterface } from './task-update-finished-request.interface';
import { TaskDeleteResponseInterface } from './task-update-delete-response.interface';
import { PropertyModel } from '../../../shared/model/property.model';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { TaskLoadResponseInterface } from './task-load-response.interface';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { TaskSaveRequestInterface } from './task-save-request.interface';
import { TaskDefaultAssigneeResponseInterface } from './task-default-assignee-response.interface';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';

@Injectable()
export class TaskApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List tasks
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: TaskSearchModel,
  ): Observable<ModelListInterface<TaskModel>> {

    return this
      .httpService
      .get<TaskListRequestInterface, TaskListResponseInterface>(
        ApiEndpointEnum.taskList,
        this.listRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * Load task
   */
  load(id: string): Observable<TaskModel> {

    return this
      .httpService
      .get<{ id: string }, TaskLoadResponseInterface>(
        ApiEndpointEnum.taskLoad,
        null,
        { id: id },
      ).pipe(
        map(response => this.loadResponse(response)),
      );
  }

  /**
   * Save task
   */
  save(model: TaskModel): Observable<LegacySaveResponseInterface> {

    const url = model.isSystemGenerated === true ? ApiEndpointEnum.taskUpdateComment : ApiEndpointEnum.taskSave;

    return this
      .httpService
      .post<TaskSaveRequestInterface, LegacySaveResponseInterface>(
        url,
        this.saveRequest(model),
        { id: model.id },
        true,
      );
  }

  /**
   * Returns observable of default task assignee
   */
  defaultAssignee(): Observable<ContactModel> {

    return this
      .httpService
      .get<null, TaskDefaultAssigneeResponseInterface>(
        ApiEndpointEnum.taskDefaultAssignee,
      )
      .pipe(
        map(response => this.defaultAssigneeResponse(response)),
      );
  }

  /**
   * Update task importance
   */
  updateImportance(taskId: string, isImportant: boolean): Observable<TaskImportanceResponseInterface> {

    const value = isImportant ? '1' : '0';

    return this
      .httpService
      .post<null, TaskImportanceResponseInterface>(
        ApiEndpointEnum.taskUpdateImportance,
        null,
        { taskId, value },
        false,
      );
  }

  /**
   * Update task state finished
   */
  updateFinished(taskId: string, isFinished: boolean): Observable<TaskFinishedResponseInterface> {

    const request: TaskFinishedRequestInterface = {
      checked: isFinished,
    };

    return this
      .httpService
      .post<TaskFinishedRequestInterface, TaskFinishedResponseInterface>(
        ApiEndpointEnum.taskUpdateFinished,
        request,
        { taskId },
        true,
      );
  }

  /**
   * Delete task
   */
  delete(taskId: string): Observable<TaskDeleteResponseInterface> {

    return this
      .httpService
      .delete<null, TaskDeleteResponseInterface>(
        ApiEndpointEnum.taskDelete,
        null,
        { taskId },
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: TaskSearchModel,
  ): TaskListRequestInterface {

    const request = <TaskListRequestInterface>{
      per_page: pagination.perPage,
      page: pagination.page,
      sort: sort.id,
      direction: sort.order,
    };

    if (filters.type) {

      request.sr_task_type = filters.type;
    }

    if (filters.dateFrom) {

      request.sr_start_date = this.helperService.dateToString(new Date(filters.dateFrom));
    }

    if (filters.dateTo) {

      request.sr_end_date = this.helperService.dateToString(new Date(filters.dateTo));
    }

    if (filters.clientIds && filters.clientIds.length > 0) {

      request.addressee_search = filters.clientIds;
    }

    if (filters.propertyIds && filters.propertyIds.length > 0) {

      request.property_search = filters.propertyIds;
    }

    if (filters.promotionIds && filters.promotionIds.length > 0) {

      request.promotion_search = filters.promotionIds;
    }

    if (filters.brokerIds && filters.brokerIds.length > 0) {

      request.assignee_search = filters.brokerIds;
    }

    if (filters.statusId || filters.statusId === '0') {

      request.sr_finished = filters.statusId;
    }

    return request;
  }

  /**
   * Handle a list() response and return a list of task models
   */
  private listResponse(response: TaskListResponseInterface): ModelListInterface<TaskModel> {

    return {
      models: response.objects_list.map((data, i) => {

        const task = new TaskModel();

        // Task
        task.id = data.id;
        task.title = data.title;
        task.typeLabel = data.task_type;
        task.createContact.id = data.created_by_id;
        task.createContact.firstName = data.created_by_firstname || '';
        task.createContact.lastName = data.created_by_lastname || '';
        task.createContact.fullName = task.createContact.getFullName();
        task.brokerNotes = data.personal_notes;
        task.readOnlyReason = data.readonly_reason;
        task.readLevel = data.readlevel;
        task.readLevelReason = data.readlevel_reason;
        task.allowedImportantReason = data.allowed_important_reason;
        task.allowedFinishReason = data.allowed_finish_reason;
        task.allowedDeleteReason = data.allowed_delete_reason;
        task.isReadonly = data.readonly;
        task.isImportant = data.important === '1';
        task.isFinished = data.finished === '1';
        task.isPublished = data.published === '1';
        task.isSystemGenerated = data.system_generated === '1';
        task.isAllowedDelete = !!data.is_allowed_delete;
        task.isAllowedFinish = !!data.is_allowed_finish;
        task.isAllowedImportant = !!data.is_allowed_important;
        task.createDate = this.helperService.stringToDate(data.created_datetime);
        task.startDate = this.helperService.stringToDate(data.start_datetime, false);

        const endDate = this.helperService.stringToDate(data.end_datetime, false);

        if (task.startDate && endDate) {

          const duration = this.helperService.duration(task.startDate, endDate);
          task.durationHours = Number(duration.split(':')[0]);
          task.durationMinutes = Number(duration.split(':')[1]);
        }

        // Brokers
        if (data.task_assignees) {

          data.task_assignees.forEach(c => {

            const broker = new ContactModel();
            broker.id = c.id;
            broker.fullName = c.name || '';
            broker.initials = c.initials || '';

            task.brokers.push(broker);
          });
        }

        // Contacts
        if (data.task_addressees) {

          data.task_addressees.forEach(c => {

            const contact = new ContactModel();
            contact.id = c.id;
            contact.fullName = c.name || '';
            contact.initials = c.initials || '';

            task.contacts.push(contact);
          });
        }

        // Properties
        if (data.properties) {

          data.properties.forEach(p => {

            const property = new PropertyModel();
            property.id = p.id;
            property.reference = p.reference;
            property.ranking = parseInt(p.ranking, 10);
            property.photoSmallURL = p.photo_thumb && p.photo_thumb.indexOf('/rf_default_property.jpg') === -1 ? p.photo_thumb : '';

            task.properties.push(property);
          });
        }

        // Promotions
        if (data.promotions) {

          data.promotions.forEach(p => {

            const promotion = new PromotionModel();
            promotion.id = p.id;
            promotion.reference = p.reference;
            promotion.name = p.name;
            promotion.propertyReservedCount = p.reserved;
            promotion.propertySoldCount = p.sold;
            promotion.propertyTotalCount = p.total;
            promotion.photoSmallURL = p.photo_thumb || '';

            task.promotions.push(promotion);
          });
        }

        return task;
      }),
      total: Number(response.paginator.item_count),
    };
  }

  /**
   * Handle a load() response and return a task model
   */
  private loadResponse(response: TaskLoadResponseInterface): TaskModel {

    const model = new TaskModel();

    model.id = response.id;
    model.title = response.title;
    model.typeId = response.task_type_id;
    model.createContact.id = response.created_by_id;
    model.createContact.initials = response.created_initials;
    model.brokerNotes = response.personal_notes;
    model.contactNotes = response.notes_sent_to_contact;
    model.publicReport = response.public_report;
    model.location = response.location;
    model.reminderAtId = response.reminder_time;
    model.agendaIds = response.google_agendas;
    model.isReadonly = response.readonly;
    model.isImportant = response.important === '1';
    model.isFinished = response.finished === '1';
    model.isPublished = response.published === '1';
    model.isSystemGenerated = response.system_generated === '1';
    model.isSendMessageToContact = response.send_notes_to_contact === '1';
    model.isSendMessageToOwner = response.send_task_to_owner === '1';
    model.isEditableByOthers = response.editable_by_others === '1';
    model.isShownInReports = response.hide_in_reports !== '1';
    model.isCalendarTask = response.is_calendar_task === '1';
    model.createDate = this.helperService.stringToDate(response.created_datetime);
    model.startDate = this.helperService.stringToDate(response.start_datetime, false);
    model.startTime = response.due_time || '';

    const endDate = this.helperService.stringToDate(response.end_datetime, false);

    if (model.startDate && endDate) {

      const duration = this.helperService.duration(model.startDate, endDate);
      model.durationHours = Number(duration.split(':')[0]);
      model.durationMinutes = Number(duration.split(':')[1]);
    }

    // Brokers
    if (response.assignees) {

      response.assignees.forEach(assignee => {

        const broker = new ContactModel();
        broker.id = assignee.contact_id;
        broker.firstName = assignee.firstname || '';
        broker.lastName = assignee.lastname || '';
        broker.fullName = broker.getFullName();
        broker.agency.id = assignee.agency_id;

        if (assignee.email) {

          const email = new ContactEmailModel();
          email.emailId = assignee.email;
          broker.emails.push(email);
        }

        model.brokers.push(broker);
      });
    }

    // Persons concerned / Clients
    if (response.contacts) {

      response.contacts.forEach(client => {

        const contact = new ContactModel();
        contact.id = client.contact_id;
        contact.firstName = client.firstname || '';
        contact.lastName = client.lastname || '';
        contact.fullName = contact.getFullName();
        contact.agency.id = client.agency_id;

        if (client.email) {

          const email = new ContactEmailModel();
          email.emailId = client.email;
          contact.emails.push(email);
        }

        model.contacts.push(contact);
      });
    }

    // Participants
    if (response.participants) {

      response.participants.forEach(contact => {

        const participant = new ContactModel();
        participant.id = contact.contact_id;
        participant.firstName = contact.firstname || '';
        participant.lastName = contact.lastname || '';
        participant.fullName = participant.getFullName();
        participant.agency.id = contact.agency_id;

        if (contact.email) {

          const email = new ContactEmailModel();
          email.emailId = contact.email;
          participant.emails.push(email);
        }

        model.contacts.push(participant);
      });
    }

    // Properties
    if (response.properties) {

      response.properties.forEach(p => {

        const property = new PropertyModel();
        property.id = p.id;
        property.reference = p.reference;
        property.isArchived = p.archive === '1';

        model.properties.push(property);
      });
    }

    // Promotions
    if (response.promotions) {

      response.promotions.forEach(p => {

        const promotion = new PromotionModel();
        promotion.id = p.id;
        promotion.name = p.name;
        promotion.isArchived = p.archive === '1';

        model.promotions.push(promotion);
      });
    }

    return model;
  }

  /**
   * Handle a save() request parameters and return a formatted request
   */
  private saveRequest(model: TaskModel): TaskSaveRequestInterface {

    const endDate = model.getEndDate();

    const request: TaskSaveRequestInterface = {
      task_type: model.typeId,
      title: model.title,
      location: model.location,
      due_date: this.helperService.dateToString(model.startDate),
      end_date: this.helperService.dateToString(endDate),
      due_time: model.startTime,
      end_time: this.helperService.getTimeString(endDate),
      personal_notes: model.brokerNotes,
      notes_sent_to_contact: model.contactNotes,
      public_report: model.publicReport,
      send_task_to_owner: model.isSendMessageToOwner === true ? '1' : '0',
      send_notes_to_contact: model.isSendMessageToContact === true ? '1' : '0',
      editable_by_others: model.isEditableByOthers === true ? '1' : '0',
      hide_in_reports: model.isShownInReports === true ? '0' : '1',
      is_calendar_task: model.isCalendarTask === true ? '1' : '0',
      reminder_time: model.reminderAtId || '',
      selectItemagenda_task: model.agendaIds,
      contact_contact_id: [],
      contact_email: [],
      contact_firstname: [],
      contact_lastname: [],
      assignee_contact_id: [],
      assignee_email: [],
      assignee_firstname: [],
      assignee_lastname: [],
      participant_contact_id: [],
      participant_email: [],
      participant_firstname: [],
      participant_lastname: [],
    };

    // Brokers
    model.brokers.forEach(broker => {

      request.assignee_contact_id = [ ...request.assignee_contact_id, broker.id ];
      request.assignee_firstname = [ ...request.assignee_firstname, broker.firstName ];
      request.assignee_lastname = [ ...request.assignee_lastname, broker.lastName ];
      request.assignee_email = broker.emails[0] ?
        [ ...request.assignee_email, broker.emails[0].emailId ] : request.assignee_email;
    });

    // Persons concerned / Clients
    model.contacts.forEach(contact => {

      request.contact_contact_id = [ ...request.contact_contact_id, contact.id ];
      request.contact_firstname = [ ...request.contact_firstname, contact.firstName ];
      request.contact_lastname = [ ...request.contact_lastname, contact.lastName ];
      request.contact_email = contact.emails[0] ?
        [ ...request.contact_email, contact.emails[0].emailId ] : request.contact_email;
    });

    // Properties
    request.properties = model.properties.map(property => property.id);

    // Promotions
    request.promotions = model.promotions.map(promotion => promotion.id);

    return request;

  }

  /**
   * Handle a defaultAssignee() response and return a contact model
   */
  private defaultAssigneeResponse(response: TaskDefaultAssigneeResponseInterface): ContactModel {

    const contact = new ContactModel();

    if (response.length === 0) {

      return contact;
    }

    contact.id = response[0].contact_id;
    contact.firstName = response[0].firstname;
    contact.lastName = response[0].lastname;
    contact.fullName = contact.getFullName();
    contact.languageId = <LanguageEnum>response[0].language_id;
    contact.agency.id = response[0].agency_id;

    const email = new ContactEmailModel();
    email.emailId = response[0].email;
    email.isMainEmail = true;

    contact.emails.push(email);

    return contact;
  }
}
