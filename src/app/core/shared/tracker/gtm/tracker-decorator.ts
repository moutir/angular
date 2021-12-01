import { TrackerDecoratorAbstract } from '../tracker-decorator.abstract';
import { TrackerInterface } from '../../../../shared/interface/tracker.interface';
import { GoogleAnalyticsEventInterface } from '../../../../shared/interface/google-analytics-event.interface';
import { UserModel } from '../../../../shared/model/user.model';
import { OrderEnum } from '../../../../shared/enum/order.enum';
import { BrochureQualityEnum } from '../../../../shared/enum/brochure-quality.enum';
import { LanguageEnum } from '../../../../shared/enum/language.enum';
import { DataLayerInterface } from '../../../../shared/interface/data-layer.interface';

export class TrackerDecorator extends TrackerDecoratorAbstract {

  /**
   * Event category applied to all events
   */
  private eventCategory: string;

  /**
   * Constructor
   */
  constructor(
    decoratedTracker: TrackerInterface,
    private dataLayer: DataLayerInterface,
  ) {

    super(decoratedTracker);
  }

  /**
   * @inheritDoc
   */
  track(action: string): void {

    super.track(action);

    this.dataLayer.push(
      this.getGoogleAnalyticsEvent(action),
    );
  }

  /**
   * @inheritDoc
   */
  trackUser(action: string, user: UserModel): void {

    super.trackUser(action, user);

    this.dataLayer.push(
      this.getGoogleAnalyticsEvent(action, this.getAgent(user)),
    );
  }

  /**
   * @inheritDoc
   */
  trackString(action: string, value: string): void {

    super.trackString(action, value);

    this.dataLayer.push(
      this.getGoogleAnalyticsEvent(action, value.trim()),
    );
  }

  /**
   * @inheritDoc
   */
  trackLabelValue(action: string, label: string, value: number): void {

    super.trackLabelValue(action, label, value);

    this.dataLayer.push(
      this.getGoogleAnalyticsEvent(action, label.trim(), value),
    );
  }

  /**
   * @inheritDoc
   */
  trackStringPair(action: string, name: string, value: string): void {

    super.trackStringPair(action, name, value);

    this.dataLayer.push(
      this.getGoogleAnalyticsEvent(
        action,
        [name.trim(), value.trim()].join(':'),
      ),
    );
  }

  /**
   * @inheritDoc
   */
  trackStringList(action: string, values: string[]): void {

    super.trackStringList(action, values);

    this.dataLayer.push(
      this.getGoogleAnalyticsEvent(
        action,
        values.filter(val => !!val).map(val => val.trim()).sort().join(','), // trim each value, sort them, join by ','
        values.length,
      ),
    );
  }

  /**
   * @inheritDoc
   */
  trackSort(action: string, name: string, order: OrderEnum): void {

    super.trackSort(action, name, order);

    this.dataLayer.push(
      this.getGoogleAnalyticsEvent(action, [name.trim(), order].join(':')),
    );
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

    super.trackStringBrochure(action, value, type, privacy, quality, language);

    this.dataLayer.push(
      this.getGoogleAnalyticsEvent(
        [action, type, privacy, quality, language].join('-'),
        value.trim(),
      ),
    );
  }

  /**
   * @inheritDoc
   */
  setUser(user: UserModel): void {

    super.setUser(user);

    this.eventCategory = user.account.contact.agency.name.trim().toUpperCase();

    this.dataLayer.push({
      agent: this.getAgent(user),
    });
  }

  /**
   * Return standardized agent name (Ex: Will SMITH)
   */
  private getAgent(user: UserModel): string {

    return [
        user.account.contact.firstName ?
          user.account.contact.firstName[0].toUpperCase() + user.account.contact.firstName.slice(1).toLowerCase() : '',
        user.account.contact.lastName.toUpperCase(),
      ]
      .join(' ')
      .trim();
  }

  /**
   * Return a Google Analytics event
   */
  private getGoogleAnalyticsEvent(action: string, label?: string, value?: number): GoogleAnalyticsEventInterface {

    return {
      event: 'GAEvent',
      eventCategory: this.eventCategory,
      eventAction: action,
      eventLabel: label || undefined,
      eventValue: typeof value === 'number' ? value : undefined,
    };
  }
}
