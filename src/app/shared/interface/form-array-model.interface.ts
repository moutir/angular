export interface FormArrayModelInterface {

  // UI usage
  isNew: boolean;
  isRemoved: boolean;

  /**
   * Return sort value
   */
  getOrder(): string;
}
