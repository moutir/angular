export interface EmailContentResponseInterface {
  [language: string]: {
    label: string;
    message: string;
    subject: string;
  };
}
