export interface ReportingStatusResponseInterface {
  data: Array<{
    id: string;
    message: string;
    success: boolean;
  }>;
  errors: Array<{
    statusCode: number;
    message: string;
    type: string;
  }>;
}
