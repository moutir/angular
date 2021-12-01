import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';

import { TranslationConfig } from './translation.config';
import { MatPaginatorIntlService } from './shared/mat-paginator-intl.service';

@NgModule({
  imports: [],
  declarations: [],
  providers: [
    TranslationConfig,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlService },
  ],
})
export class TranslationModule {

}
