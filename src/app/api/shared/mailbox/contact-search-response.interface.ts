export interface ContactSearchResponseInterface extends Array<{
  agency_id: string; // agency id
  contact_id: string; // contact id
  email: string; // contact email
  firstname: string; // contact firstname
  language: string; // language
  lastname: string; // contact lastname
  search: string; // fullname + email
}> {

}
