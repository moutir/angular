import { ClipboardStrategyAbstract } from './clipboard-strategy.abstract';
import { Injectable } from '@angular/core';

@Injectable()
export class ClipboardService {

  /**
   * Constructor
   */
  constructor(private strategy: ClipboardStrategyAbstract) {

  }

  /**
   * Copy text to clipboard
   */
  copy(text: string): void {

    this.strategy.copy(text);
  }
}
