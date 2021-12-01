export interface EmailingPreviewRequestInterface {
  language: string;
  hide_price: number;
  subject: string;
  message: string;
  properties: string[];
  promotions: string[];
}
