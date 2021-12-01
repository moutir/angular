import { TrackerInterface } from '../../../shared/interface/tracker.interface';
import { UserModel } from '../../../shared/model/user.model';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { BrochureQualityEnum } from '../../../shared/enum/brochure-quality.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';

export abstract class TrackerDecoratorAbstract implements TrackerInterface {

  /**
   * Decorated tracker
   */
  protected decoratedTracker: TrackerInterface;

  /**
   * Constructor
   */
  constructor(
    decoratedTracker: TrackerInterface,
  ) {

    this.decoratedTracker = decoratedTracker;
  }

  /**
   * @inheritDoc
   */
  track(action: string): void {

    this.decoratedTracker.track(action);
  }

  /**
   * @inheritDoc
   */
  trackUser(action: string, user: UserModel): void {

    this.decoratedTracker.trackUser(action, user);
  }

  /**
   * @inheritDoc
   */
  trackString(action: string, value: string): void {

    this.decoratedTracker.trackString(action, value);
  }

  /**
   * @inheritDoc
   */
  trackLabelValue(action: string, label: string, value: number): void {

    this.decoratedTracker.trackLabelValue(action, label, value);
  }

  /**
   * @inheritDoc
   */
  trackStringPair(action: string, name: string, value: string): void {

    this.decoratedTracker.trackStringPair(action, name, value);
  }

  /**
   * @inheritDoc
   */
  trackStringList(action: string, values: string[]): void {

    this.decoratedTracker.trackStringList(action, values);
  }

  /**
   * @inheritDoc
   */
  trackSort(action: string, name: string, order: OrderEnum): void {

    this.decoratedTracker.trackSort(action, name, order);
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

    this.decoratedTracker.trackStringBrochure(action, value, type, privacy, quality, language);
  }

  /**
   * @inheritDoc
   */
  setUser(user: UserModel): void {

    this.decoratedTracker.setUser(user);
  }
}
