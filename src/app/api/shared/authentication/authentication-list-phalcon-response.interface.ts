export interface AuthenticationListPhalconResponseInterface {
  agency: Array<{
    id: string;
    account_id: string;
    account_type_id: string;
    agency_id: string;
    agency_name: string;
    avatar: string;
    city: string;
    firstname: string;
    lastname: string;
    login: string;
  }>;
  other: Array<{
    id: string;
    account_id: string;
    account_type_id: string;
    agency_id: string;
    agency_name: string;
    avatar: string;
    city: string;
    firstname: string;
    lastname: string;
    login: string;
  }>;
}
