import { LanguageEnum } from '../../../shared/enum/language.enum';
import { KeyValueType } from '../../../shared/type/key-value.type';

export interface EmailTemplateLoadResponseInterface {
  data: {
    i18n: KeyValueType<LanguageEnum, { label: string; subject: string; message: string; }>;
    shared: number;
    creator: string;
  };
  success: boolean;
  message: string;
  create_contact: {
    id: string;
    initials: string;
    firstname: string;
    lastname: string;
    fullname: string;
  };
  create_datetime: string;
  update_contact: {
    id: string;
    firstname: string;
    lastname: string;
    initials: string;
  };
  update_datetime: string;
}
