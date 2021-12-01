import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MatPaginatorIntlService extends MatPaginatorIntl {

  /**
   * Translated labels
   */
  firstPageLabel: string = 'First page';
  itemsPerPageLabel: string = 'Items per page';
  lastPageLabel: string = 'Last page';
  nextPageLabel: string = 'Next page';
  previousPageLabel: string = 'Previous page';

  /**
   * Constructor
   */
  constructor(private translateService: TranslateService) {

    super();

    this.translateService.onLangChange.subscribe(() => { this.translate(); });

    this.translate();
  }

  /**
   * @inheritDoc
   */
  getRangeLabel = (page: number, pageSize: number, length: number): string => {

    const of = this.translateService.instant('label_paginator_of');

    if (length === 0 || pageSize === 0) {

      return ['0', of, length].join(' ');
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return [startIndex + 1, '-', endIndex, of, length].join(' ');
  }

  /**
   * Translate labels
   */
  private translate(): void {

    this.firstPageLabel = this.translateService.instant('label_paginator_first_page');
    this.itemsPerPageLabel = this.translateService.instant('label_paginator_items_per_page');
    this.lastPageLabel = this.translateService.instant('label_paginator_last_page');
    this.nextPageLabel = this.translateService.instant('label_paginator_next_page');
    this.previousPageLabel = this.translateService.instant('label_paginator_previous_page');
  }
}
