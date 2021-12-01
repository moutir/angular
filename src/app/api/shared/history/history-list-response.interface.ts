import { Dictionary } from '../../../shared/class/dictionary';

export interface HistoryListResponseInterface {
  history: {
    [ month_year: string ]: Array<{
      agency_id: string;
      agency_logo: string;
      client_ids: string[];
      connected_user: boolean;
      event_date: string;
      event_datetime: string;
      event_icon: string;
      event_label: string;
      event_maker: string;
      event_maker_full_name: string;
      event_maker_id: string;
      event_object_html: string;
      event_object_id: string;
      event_object_label: string;
      event_type: string;
      logo: string;
      month_year: string;
      link: string;
      task_id: string;
      event_data_diff: Dictionary<string>|null;
    }>;
  };
  [ module: string ]: {};
}
