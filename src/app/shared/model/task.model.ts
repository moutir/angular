import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { PropertyModel } from './property.model';
import { PromotionModel } from './promotion.model';

export class TaskModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'createContact',
    'contacts',
    'brokers',
    'properties',
    'promotions',
  ];

  /**
   * Task ID
   */
  id: string = '';

  /**
   * Task title
   */
  title: string = '';

  /**
   * Type
   */
  typeId: string = '';

  /**
   * Broker notes
   */
  brokerNotes: string = '';

  /**
   * Notes for person concerned/client
   */
  contactNotes: string = '';

  /**
   * Public report
   */
  publicReport: string = '';

  /**
   * Reminder
   */
  reminderAtId: string = null;

  /**
   * Type label
   */
  typeLabel: string = '';

  /**
   * Reminder label
   */
  reminderAtLabel: string = '';

  /**
   * Agenda labels
   */
  agendaLabels: string[] = [];

  /**
   * Agenda IDs
   */
  agendaIds: string[] = [];

  /**
   * Created by
   */
  createContact: ContactModel = new ContactModel();

  /**
   * Creation date
   */
  createDate: Date|null = null;

  /**
   * Participants (clients)
   */
  contacts: ContactModel[] = [];

  /**
   * Brokers
   */
  brokers: ContactModel[] = [];

  /**
   * Start date
   */
  startDate: Date|null = new Date();

  /**
   * Start time
   */
  startTime: string = '';

  /**
   * Duration hours
   */
  durationHours: number|null = null;

  /**
   * Duration minutes
   */
  durationMinutes: number|null = null;

  /**
   * Properties
   */
  properties: PropertyModel[] = [];

  /**
   * Promotions
   */
  promotions: PromotionModel[] = [];

  /**
   * Readonly reason
   */
  readOnlyReason: string = '';

  /**
   * Read level
   */
  readLevel: number = 0;

  /**
   * Read level reason
   */
  readLevelReason: string = '';

  /**
   * Reason for marking important
   */
  allowedImportantReason: string = '';

  /**
   * Reason for marking finished
   */
  allowedFinishReason: string = '';

  /**
   * Reason for delete action
   */
  allowedDeleteReason: string = '';

  /**
   * Is the task readonly?
   */
  isReadonly: boolean = false;

  /**
   * Is the task important?
   */
  isImportant: boolean = false;

  /**
   * Is the task finished?
   */
  isFinished: boolean = false;

  /**
   * Is the task published?
   */
  isPublished: boolean = false;

  /**
   * Is the task system generated?
   */
  isSystemGenerated: boolean = false;

  /**
   * Is it allowed to delete?
   */
  isAllowedDelete: boolean = false;

  /**
   * Is mark as finished allowed?
   */
  isAllowedFinish: boolean = false;

  /**
   * Is mark as important allowed?
   */
  isAllowedImportant: boolean = false;

  /**
   * Message can be send to person concerned/client?
   */
  isSendMessageToContact: boolean = false;

  /**
   * Message can be send to property owner?
   */
  isSendMessageToOwner: boolean = false;

  /**
   * Is the task editable by others?
   */
  isEditableByOthers: boolean = true;

  /**
   * Is the task shown in reports?
   */
  isShownInReports: boolean = true;

  /**
   * Is it a calendar task?
   */
  isCalendarTask: boolean = false;

  /**
   * Is the title autogenerated?
   */
  isTitleAutoGenerated: boolean = true;

  /**
   * @deprecated
   */
  location: string = '';

  /**
   * Returns task end date
   */
  getEndDate(): Date|null {

    if (!this.startDate || (!this.durationHours && !this.durationMinutes)) {

      return null;
    }

    const startDate = new Date(this.startDate);
    const endDate = new Date(this.startDate);
    const startTime = this.startTime.split(':');

    startDate.setHours(Number(startTime[0] || ''), Number(startTime[1] || ''));
    endDate.setHours((startDate.getHours() + this.durationHours || 0), (startDate.getMinutes() + this.durationMinutes || 0));

    return endDate;
  }

  /**
   * Returns generated task title
   */
  getGeneratedTitle(): string {

    // Contacts
    const titleContacts = this.contacts
      .map(contact => (contact.fullName || '').split(' - ')[0])
      .filter(Boolean).join(', ');

    // Properties
    const titleProperties = this.properties
      .map(property => [property.reference, property.location.label].filter(Boolean).join(' | '))
      .filter(Boolean).join(', ');

    // Promotions
    const titlePromotions = this.promotions
      .map(promotion => [promotion.name, (promotion.reference || promotion.location.label)].filter(Boolean).join(' | '))
      .filter(Boolean).join(', ');

    return [
      this.typeLabel,
      titleContacts,
      titleProperties,
      titlePromotions,
    ].filter(Boolean).join(' - ');
  }
}