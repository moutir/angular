import { ModuleWithProviders, NgModule, Provider } from '@angular/core';

import { RuntimeConfig } from './runtime.config';
import { RuntimeService } from './shared/runtime.service';

@NgModule({
  imports: [],
  declarations: [],
  providers: [],
})
export class RuntimeModule {

  /**
   * Return providers for root usage only
   */
  static forRoot(config: {
    dataProvider: Provider;
  }): ModuleWithProviders {

    return {
      ngModule: RuntimeModule,
      providers: [
        RuntimeConfig,
        RuntimeService,
        config.dataProvider,
      ],
    };
  }
}
