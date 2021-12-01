import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KeywordInterface } from '../../interface/keyword.interface';

@Component({
  selector: 'app-shared-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss'],
})
export class KeywordsComponent {

  /**
   * List of keywords
   */
  @Input() keywords: KeywordInterface[];

  /**
   * Are keywords removable ?
   */
  @Input() isRemovable: boolean = true;

  /**
   * Keyword removed
   */
  @Output() removeKeyword: EventEmitter<KeywordInterface> = new EventEmitter<KeywordInterface>();

  /**
   * Track by name and value
   */
  trackByNameValue(index: number, keyword: KeywordInterface): string {

    return keyword.name + '+' + keyword.value;
  }

  /**
   * Removed keyword
   */
  onRemoved(keyword: KeywordInterface): void {

    if (keyword.isRemovable === false) {

      return;
    }

    this.removeKeyword.emit(keyword);
  }
}
