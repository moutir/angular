export interface TaskLoadResponseInterface {
  id: string;
  title: string;
  task_type_id: string;
  task_list_id: string;
  agency_id: string;
  created_by_id: string;
  created_initials: string;
  created_time: string;
  deleted: string;
  due_date: string;
  due_time: string;
  editable_by_others: string;
  emailing_id: string;
  end_date: string;
  end_time: string;
  finished: string;
  finished_by_id: string;
  finished_time: string;
  google_agendas: string[];
  hide_in_reports: string;
  important: string;
  is_calendar_task: string;
  location: string;
  notes_sent_to_contact: string;
  old_id: string;
  personal_notes: string;
  private: string;
  assignees: Array<{
    contact_id: string;
    agency_id: string;
    email: string;
    firstname: string;
    lastname: string;
    search: string;
  }>;
  contacts: Array<{
    contact_id: string;
    agency_id: string;
    email: string;
    firstname: string;
    lastname: string;
    search: string;
  }>;
  participants: Array<{
    contact_id: string;
    agency_id: string;
    email: string;
    firstname: string;
    lastname: string;
    search: string;
  }>;
  promotions: Array<{
    id: string;
    name: string;
    archive: string;
  }>;
  properties: Array<{
    id: string;
    reference: string;
    archive: string;
  }>;
  public_report: string;
  published: string;
  readonly: boolean;
  reminder_time: string;
  send_invitation_to_assignee: string;
  send_invitation_to_participant: string;
  send_notes_to_contact: string;
  send_task_to_owner: string;
  system_generated: string;
  task_created_from_global_matching: string;
  created_datetime: string;
  start_datetime: string;
  end_datetime: string;
}
