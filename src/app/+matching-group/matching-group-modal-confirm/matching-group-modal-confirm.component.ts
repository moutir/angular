import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { MatchingGroupActionSelectionInterface } from '../../shared/interface/matching-group-action-selection.interface';
import { MatchingActionEnum } from '../../shared/enum/matching-action.enum';
import { Dictionary } from '../../shared/class/dictionary';

@Component({
  selector: 'app-matching-group-modal-confirm',
  templateUrl: './matching-group-modal-confirm.component.html',
  styleUrls: ['./matching-group-modal-confirm.component.scss'],
})
export class MatchingGroupModalConfirmComponent extends ModalComponentAbstract<void> implements OnChanges {

  /**
   * List of action selections
   */
  @Input() actionSelection: Dictionary<MatchingGroupActionSelectionInterface> = {};

  /**
   * List of confirmations count/label pairs
   */
  confirmations: Array<{
    matchingCount: number;
    contactCount: number;
    label: string;
  }> = [];

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    if (!changes.actionSelection) {

      return;
    }

    // Reset confirmations
    this.confirmations = [];

    const confirmation: Dictionary<{
      matchingCount: number;
      contactIds: string[];
      label: string;
    }> = {};

    confirmation[MatchingActionEnum.send] = {
      matchingCount: 0,
      contactIds: [],
      label: 'label_matching_confirm_send',
    };
    confirmation[MatchingActionEnum.process] = {
      matchingCount: 0,
      contactIds: [],
      label: 'label_matching_confirm_process',
    };
    confirmation[MatchingActionEnum.transfer] = {
      matchingCount: 0,
      contactIds: [],
      label: 'label_matching_confirm_transfer',
    };
    confirmation[MatchingActionEnum.delay] = {
      matchingCount: 0,
      contactIds: [],
      label: 'label_matching_confirm_delay',
    };
    confirmation[MatchingActionEnum.refuse] = {
      matchingCount: 0,
      contactIds: [],
      label: 'label_matching_confirm_refuse',
    };

    const contactIds = [];

    Object
      .keys(this.actionSelection)
      .forEach(key => {

        // Action has no matching or is "wait"
        if (this.actionSelection[key].matchingId === null || this.actionSelection[key].actionId === MatchingActionEnum.wait) {

          return;
        }

        // Increment matches count
        confirmation[this.actionSelection[key].actionId].matchingCount++;

        // Contact not counted already
        if (confirmation[this.actionSelection[key].actionId].contactIds.indexOf(this.actionSelection[key].contactId) === -1) {

          confirmation[this.actionSelection[key].actionId].contactIds.push(this.actionSelection[key].contactId);
        }
      });

    Object
      .keys(confirmation)
      .forEach(key => {

        if (confirmation[key].matchingCount === 0) {

          return;
        }

        const label = [
          confirmation[key].label,
          confirmation[key].matchingCount > 1 ? 'plural' : 'singular',
        ];

        // Action is "send"
        if (key === MatchingActionEnum.send) {

          label.push(confirmation[key].contactIds.length > 1 ? 'plural' : 'singular');
        }

        this.confirmations.push({
          matchingCount: confirmation[key].matchingCount,
          contactCount: confirmation[key].contactIds.length,
          label: label.join('_'),
        });
      });
  }
}
