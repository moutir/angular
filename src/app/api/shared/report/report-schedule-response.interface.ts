export interface ReportScheduleResponseInterface {
  data: Array<{}>;
  errors: Array<{
    code: number;
    message: string;
    type: string;
    exception: string;
  }>;
  validation: Array<{}>;
}
