export class CountState {

  /**
   * Leads count
   */
  leadCount: number;

  /**
   * Leads to answer count
   */
  leadToAnswerCount: number;

  /**
   * Mailbox count
   */
  mailboxCount: number;

  /**
   * Matching contact count
   */
  matchingContactCount: number;

  /**
   * Matching property count
   */
  matchingPropertyCount: number;

  /**
   * Matching promotion count
   */
  matchingPromotionCount: number;

  /**
   * Contact to follow up count
   */
  contactToFollowUpCount: number;

  /**
   * Contact with invalid email count
   */
  contactInvalidEmailCount: number;

  /**
   * Contact without search count
   */
  contactNoSearchCount: number;

  /**
   * Report validation count
   */
  reportValidationCount: number;

  /**
   * Constructor
   */
  constructor() {

    // Default values
    this.leadCount = 0;
    this.mailboxCount = 0;
    this.matchingContactCount = 0;
    this.matchingPropertyCount = 0;
    this.matchingPromotionCount = 0;
    this.contactToFollowUpCount = 0;
    this.contactInvalidEmailCount = 0;
    this.contactNoSearchCount = 0;
    this.reportValidationCount = 0;
  }
}
