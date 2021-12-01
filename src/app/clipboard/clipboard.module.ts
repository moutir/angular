import { ClipboardModule as NgxClipboardModule, ClipboardService as NgxClipboardService } from 'ngx-clipboard';
import { NgModule } from '@angular/core';
import { NgxClipboardStrategy } from './shared/strategy/ngx-clipboard.strategy';

import { ClipboardService } from './shared/clipboard.service';
import { ClipboardStrategyAbstract } from './shared/clipboard-strategy.abstract';

@NgModule({
  imports: [
    NgxClipboardModule,
  ],
  providers: [
    ClipboardService,
    {
      provide: ClipboardStrategyAbstract,
      useClass: NgxClipboardStrategy,
      deps: [NgxClipboardService],
    },
  ],
})
export class ClipboardModule {

}
