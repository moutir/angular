import { Component, Input } from '@angular/core';

import { ContactModel } from '../../model/contact.model';

@Component({
  selector: 'app-shared-history-panel',
  templateUrl: './history-panel.component.html',
  styleUrls: ['./history-panel.component.scss'],
})
export class HistoryPanelComponent {

  /**
   * Contact model (create)
   */
  @Input() createContact: ContactModel = new ContactModel();

  /**
   * Date (create)
   */
  @Input() createDate: Date|null = null;

  /**
   * Contact model (update)
   */
  @Input() updateContact: ContactModel = new ContactModel();

  /**
   * Date (update)
   */
  @Input() updateDate: Date|null = null;

  /**
   * Is the component a placeholder ?
   */
  @Input() isPlaceholder: boolean = false;

  /**
   * Is for Realforce eyes only ?
   */
  @Input() isRealforceOnly: boolean = false;
}
