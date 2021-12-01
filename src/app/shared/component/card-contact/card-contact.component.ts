import { Component, Input } from '@angular/core';

import { ContactModel } from '../../model/contact.model';

@Component({
  selector: 'app-shared-card-contact',
  templateUrl: './card-contact.component.html',
  styleUrls: ['./card-contact.component.scss'],
})
export class CardContactComponent {

  /**
   * Contact model
   */
  @Input() contact: ContactModel = new ContactModel();

  /**
   * Can show the summary ?
   */
  @Input() hasSummary: boolean = true;

  /**
   * Is the component a placeholder ?
   */
  @Input() isPlaceholder: boolean = false;

  /**
   * Contact's person in charge
   */
  @Input() personInCharge: ContactModel;
}
