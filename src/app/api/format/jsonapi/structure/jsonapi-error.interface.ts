export interface JsonapiErrorInterface {
  status: string;
  title: string;
  code: string;
  source: {
    pointer: string;
  };
}
