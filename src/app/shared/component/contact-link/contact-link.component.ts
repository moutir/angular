import { Component, Input, OnInit } from '@angular/core';

import { ContactService } from '../../../core/shared/contact/contact.service';
import { ContactModel } from '../../model/contact.model';
import { ContactLinkLayoutType } from '../../type/contact-link-layout.type';

@Component({
  selector: 'app-shared-contact-link',
  templateUrl: './contact-link.component.html',
  styleUrls: ['./contact-link.component.scss'],
})
export class ContactLinkComponent implements OnInit {

  /**
   * Contact model
   */
  @Input() contact: ContactModel = new ContactModel();

  /**
   * Layout type
   */
  @Input() layout: ContactLinkLayoutType = 'client';

  /**
   * Tooltip text
   */
  @Input() tooltip: string = '';

  /**
   * Tooltip position
   */
  @Input() tooltipPosition: string = 'left';

  /**
   * Placeholder mode?
   */
  @Input() isPlaceholder: boolean = false;

  /**
   * Has tooltip?
   */
  @Input() hasTooltip: boolean = true;

  /**
   * Has warning?
   */
  @Input() hasWarning: boolean = false;

  /**
   * Has label under the initials?
   */
  @Input() hasLabel: boolean = true;

  /**
   * Stop event propagation ?
   */
  @Input() isStopPropagation: boolean = true;

  /**
   * Tooltip text in case of warning
   */
  @Input() warningLabel: string;

  /**
   * Security hash
   */
  @Input() hash: string = '';

  /**
   * Constructor
   */
  constructor(
    private contactService: ContactService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.tooltip = this.layout === 'client' ?
      (this.hasWarning === true ? this.warningLabel : this.tooltip) :
      (this.hasWarning === true ? this.warningLabel : (this.hasTooltip ? this.tooltip || 'label_contact_' + this.layout : ''))
    ;
  }

  /**
   * Clicked on contact
   */
  onClick(event: MouseEvent): void {

    // Prevent propagation of click event
    if (['client', 'confidential'].indexOf(this.layout) === -1 || this.isStopPropagation === true) {

      // Prevent propagation of click event
      event.stopPropagation();
    }

    // Nothing happens if no ID available or it is a placeholder or is confidential
    if (!this.contact.id || this.isPlaceholder || this.contact.isConfidential) {

      return;
    }

    this.contactService.preview(
      this.contact.id, {
        x: event.clientX,
        y: event.clientY,
      },
      this.hash,
    );
  }
}
