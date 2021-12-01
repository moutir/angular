import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { FisherModule } from './app/fisher/fisher.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(FisherModule)
  .catch(err => console.log(err));
