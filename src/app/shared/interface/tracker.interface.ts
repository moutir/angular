import { UserModel } from '../model/user.model';
import { OrderEnum } from '../enum/order.enum';
import { BrochureQualityEnum } from '../enum/brochure-quality.enum';
import { LanguageEnum } from '../enum/language.enum';

export interface TrackerInterface {

  /**
   * Track an action, no additional data should be sent (Ex: 'navigation-fold')
   */
  track(action: string): void;

  /**
   * Track an action with a UserModel as additional data (Ex: 'user-change', user)
   */
  trackUser(action: string, user: UserModel): void;

  /**
   * Track an action with a string as additional data (Ex: 'property-edit', 'ref123')
   */
  trackString(action: string, value: string): void;

  /**
   * Track an action with label value as additional data (Ex: 'expense-portal', 'other', 1000)
   */
  trackLabelValue(action: string, label: string, value: number): void;

  /**
   * Track an action with a pair of strings as additional data (Ex: 'property-filter-change', 'bedrooms', '3')
   */
  trackStringPair(action: string, name: string, value: string): void;

  /**
   * Track an action with an array of strings as additional data (Ex: 'property-mass-email', ['ref123', 'ref456', 'ref789'])
   */
  trackStringList(action: string, values: string[]): void;

  /**
   * Track an action with order values as additional data (Ex: 'property-list-sort', 'price', 'asc')
   */
  trackSort(action: string, name: string, order: OrderEnum): void;

  /**
   * Track an action with a string and brochure values as additional data
   * (Ex: 'property-row-brochure', 'ref123', 'prestige', 'anonymous', 'print', 'fr')
   */
  trackStringBrochure(
    action: string,
    value: string,
    type: string,
    privacy: string,
    quality: BrochureQualityEnum,
    language: LanguageEnum,
  ): void;

  /**
   * Set active user
   */
  setUser(user: UserModel): void;
}
