export interface PropertyPublicationRequestInterface {
  websites?: Array<{ id: string, publish: number }>;
  gateways?: Array<{ id: string, publish: number }>;
  properties: string[];
  publication_website_publish_up?: string;
  publication_website_publish_down?: string;
  publication_gateway_publish_up?: string;
  publication_gateway_publish_down?: string;
}
