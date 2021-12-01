import { TrackerInterface } from '../../../shared/interface/tracker.interface';
import { UserModel } from '../../../shared/model/user.model';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { BrochureQualityEnum } from '../../../shared/enum/brochure-quality.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';

export class TrackerService implements TrackerInterface {

  /**
   * @inheritDoc
   */
  track(action: string): void {

    // TODO[later] Call logger if debug mode
  }

  /**
   * @inheritDoc
   */
  trackUser(action: string, user: UserModel): void {

    // TODO[later] Call logger if debug mode
  }

  /**
   * @inheritDoc
   */
  trackString(action: string, value: string): void {

    // TODO[later] Call logger if debug mode
  }

  /**
   * @inheritDoc
   */
  trackLabelValue(action: string, label: string, value: number): void {

    // TODO[later] Call logger if debug mode
  }

  /**
   * @inheritDoc
   */
  trackStringPair(action: string, name: string, value: string): void {

    // TODO[later] Call logger if debug mode
  }

  /**
   * @inheritDoc
   */
  trackStringList(action: string, values: string[]): void {

    // TODO[later] Call logger if debug mode
  }

  /**
   * @inheritDoc
   */
  trackSort(action: string, name: string, order: OrderEnum): void {

    // TODO[later] Call logger if debug mode
  }

  /**
   * @inheritDoc
   */
  trackStringBrochure(
    action: string,
    value: string,
    type: string,
    privacy: string,
    quality: BrochureQualityEnum,
    language: LanguageEnum,
  ): void {

    // TODO[later] Call logger if debug mode
  }

  /**
   * @inheritDoc
   */
  setUser(user: UserModel): void {

    // TODO[later] Call logger if debug mode
  }
}
