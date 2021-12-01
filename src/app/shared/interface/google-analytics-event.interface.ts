export interface GoogleAnalyticsEventInterface {
  event: string;
  eventCategory: string;
  eventAction: string;
  eventLabel: string|undefined;
  eventValue: number|undefined;
}
