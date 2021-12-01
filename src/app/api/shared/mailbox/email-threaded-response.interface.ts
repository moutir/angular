import { EmailResponseInterface } from './email-response.interface';

export interface EmailThreadedResponseInterface {
  prev: string;
  next: string;
  threads: EmailResponseInterface[];
}
