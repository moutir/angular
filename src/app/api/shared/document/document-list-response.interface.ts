export interface DocumentListResponseInterface {
  data: {
    allDocuments: Array<{
      id: string;
      agency_id: string;
      contact_id: string;
      filename: string;
      promotion_id: string;
      promotion_name: string;
      property_id: string;
    }>;
  };
}
