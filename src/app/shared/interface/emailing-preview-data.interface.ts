export class EmailingPreviewDataInterface {
  template: string;
  data: {
    agencyData: object;
    baseUrl: string;
    copyrightYear: string;
    extraCloseTag: boolean;
    labelContactFollowUpNo: string;
    labelContactFollowUpYes: string;
    label_all_rights_reserved: string;
    label_email_disclaimer: string;
    message: string;
    promotionData: object[];
    propertyData: object[];
    senderData: object;
    subject: string;
  };
}
