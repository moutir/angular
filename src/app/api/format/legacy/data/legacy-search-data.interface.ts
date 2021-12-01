import { LegacyContactDataInterface } from './legacy-contact-data.interface';

export interface LegacySearchDataInterface {
  id: string;
  title: string;
  brokerContact: LegacyContactDataInterface|null;
  statusId: string;
}
