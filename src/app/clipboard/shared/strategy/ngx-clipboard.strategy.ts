import { ClipboardService } from 'ngx-clipboard';

import { ClipboardStrategyAbstract } from '../clipboard-strategy.abstract';

export class NgxClipboardStrategy extends ClipboardStrategyAbstract {

  /**
   * Constructor
   */
  constructor(private clipboard: ClipboardService) {

    super();
  }

  /**
   * @inheritDoc
   */
  copy(text: string): void {

    this.clipboard.copy(text);
  }
}
