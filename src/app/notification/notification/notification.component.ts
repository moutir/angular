import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NotificationInterface } from '../../shared/interface/notification.interface';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';

@Component({
  selector: 'app-shared-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnChanges {

  /**
   * Notification to display
   */
  @Input() notification: NotificationInterface|null;

  /**
   * List of notifications
   */
  notifications: NotificationInterface[] = [];

  /**
   * Last notification added timestamp
   */
  private lastAddTimestamp: number = 0;

  /**
   * Delay between 2 add notification calls
   */
  private lastAddDelay: number = 2500;

  /**
   * Retry delay between 2 add notification
   */
  private retryDelay: number = 500;

  /**
   * Animation duration (should match CSS) // TODO[later] use angular animation to keep duration only in TS ?
   */
  private animationDuration: number = 4000;
  private animationDurationType: { [type: string]: number } = {};

  /**
   * Constructor
   */
  constructor() {

    this.animationDurationType[NotificationTypeEnum.failure] = 8000;
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.notification && this.notification !== null) {

      this.addNotification(this.notification);
    }
  }

  /**
   * Track notification by timestamp
   */
  trackByTimestamp(index: number, notification: NotificationInterface): number {

    return notification.timestamp;
  }

  /**
   * Add a notification
   */
  private addNotification(notification: NotificationInterface): void {

    const timestamp = Date.now();

    // Adding a notification too early
    if (timestamp - this.lastAddTimestamp < this.lastAddDelay) {

      // Retry in 1000ms
      setTimeout(() => this.addNotification(notification), this.retryDelay);

      return;
    }

    // Add to notifications list
    this.notifications = [...this.notifications, notification];
    this.lastAddTimestamp = timestamp;

    // Delay removal
    setTimeout(() => this.removeNotification(notification), this.animationDurationType[notification.type] || this.animationDuration);
  }

  /**
   * Remove a notification
   */
  private removeNotification(notification: NotificationInterface): void {

    // Remove from notifications list
    this.notifications = this.notifications.filter(n => n !== notification);
  }
}
