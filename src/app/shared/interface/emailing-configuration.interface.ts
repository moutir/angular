export interface EmailingConfigurationInterface {
  subject: string;
  message: string;
  replyTo: string;
  leadIds: string[];
  recipients: Array<{
    id: string;
    firstName: string;
    lastName: string;
    languageId: string;
    agencyId: string;
    email: string;
    type: string;
  }>;
  isManageLeadByEmail: boolean;
}
