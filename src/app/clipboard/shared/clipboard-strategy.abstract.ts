import { Injectable } from '@angular/core';

@Injectable()
export abstract class ClipboardStrategyAbstract {

  /**
   * Copy text to clipboard
   */
  abstract copy(text: string): void;
}
