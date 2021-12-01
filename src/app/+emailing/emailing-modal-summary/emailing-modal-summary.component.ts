import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { RecipientSummaryInterface } from '../../shared/interface/recipient-summary.interface';
import { KeyValueType } from '../../shared/type/key-value.type';

@Component({
  selector: 'app-emailing-modal-summary',
  templateUrl: './emailing-modal-summary.component.html',
  styleUrls: ['./emailing-modal-summary.component.scss'],
})
export class EmailingModalSummaryComponent
  extends ModalComponentAbstract<null> implements OnChanges {

  /**
   * Recipient summaries
   */
  @Input() summaries: RecipientSummaryInterface[] = [];

  /**
   * Available languages
   */
  @Input() languages: KeyValueType<LanguageEnum, string> = {};

  /**
   * Error count
   */
  errorCount: number = 0;

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    if (changes.summaries) {

      this.errorCount = this.summaries.filter(summary => !!summary.error).length;
    }
  }
}
