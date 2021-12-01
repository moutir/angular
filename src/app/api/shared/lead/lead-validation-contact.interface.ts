export interface LeadValidationContactInterface {
  id: string;
  name: string;
  title: string;
  emails: string[];
  is_archived: boolean;
  match_by: string;
  address: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    line3: string;
    zipcode: string;
  };
  phones: Array<{
    type: string;
    type_id: string;
    value: string;
  }>;
}
