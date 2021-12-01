export interface TaskListResponseInterface {
  objects_list: Array<{
    id: string;
    created_by_firstname: string;
    created_by_id: string;
    created_by_lastname: string;
    disable_finished: boolean; // Deprecated
    due_date: string;
    due_time: string;
    editable_by_others: string;
    finished: string;
    important: string;
    published: string;
    created_datetime: string;
    start_datetime: string;
    end_datetime: string;
    personal_notes: string;
    readonly: boolean;
    show_delete: boolean; // Deprecated
    show_delete_column: boolean; // Deprecated
    system_generated: string;
    task_addressees: Array<{
      id: string;
      name: string;
      initials: string;
    }>;
    task_assignees: Array<{
      id: string;
      name: string;
      initials: string;
    }>;
    properties: Array<{
      id: string;
      reference: string;
      ranking: string;
      photo_thumb: string;
    }>;
    promotions: Array<{
      id: string;
      reference: string;
      name: string;
      photo_thumb: string;
      reserved: number;
      sold: number;
      total: number;
    }>;
    readonly_reason: string;
    readlevel: number;
    readlevel_reason: string;
    allowed_important_reason: string;
    allowed_finish_reason: string;
    allowed_delete_reason: string;
    title: string;
    task_type: string;
    is_allowed_important: boolean;
    is_allowed_finish: boolean;
    is_allowed_delete: boolean;
  }>;
  paginator: {
    item_count: string;
    per_page: number;
    pages: number[];
    first_page: number;
    last_page: number;
    current_page: string;
  };
}
