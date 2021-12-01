export class ClientModel {
  client_name: string;
  contact_type: {
    buyer: boolean;
    tenant: boolean;
  };
  days: number;
  id: number;
  main_broker_id: number;
  manager_name: string;
  rental_broker_id: number|null;
  sale_broker_id: number|null;
  stage: number;
}
