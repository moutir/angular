import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ContactModel } from '../../model/contact.model';

@Component({
  selector: 'app-shared-preview-contact',
  templateUrl: './preview-contact.component.html',
  styleUrls: ['./preview-contact.component.scss'],
})
export class PreviewContactComponent implements OnChanges {

  /**
   * Contact to preview or null if not available yet
   */
  @Input() contact: ContactModel|null;

  /**
   * Broker type IDs
   * TODO[nico] Remove this and runtimeContactTypeByGroup$, and the inclusion of RuntimeDataEnum.contactTypeByGroup in every single module!
   */
  @Input() brokerTypeIds: string[] = [];

  /**
   * Is the contact a broker ?
   */
  isTypeBroker: boolean = false;

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.contact && this.contact) {

      this.isTypeBroker = this.contact.contactTypeIds.some(type => this.brokerTypeIds.indexOf(type) > -1);
    }
  }
}
