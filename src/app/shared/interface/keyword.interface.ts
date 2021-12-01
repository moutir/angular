export interface KeywordInterface {
  name: string; // Usually linked to a form input name
  value: string|number|Date; // Usually linked to a form input value
  translation: string; // Translation key
  label: string; // Label to inject in the translation
  labelKey: string; // Label key to inject in the translation
  isSynced: boolean; // Synced to the form search ?
  isRemovable: boolean; // Can the keyword be removed ?
}
