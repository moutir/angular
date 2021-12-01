import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routerReducer } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';

import { UiFisherModule } from './ui-fisher/ui-fisher.module';
import { DataFisherModule } from './data-fisher/data-fisher.module';
import { DataRuntimeModule } from '../../core-store/data-runtime/data-runtime.module';
import { environment } from '../../../environments/environment';
import { UiRuntimeModule } from '../../core-store/ui-runtime/ui-runtime.module';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(
      environment.production ? {} : { router: routerReducer },
      { metaReducers: environment.production ? [] : [storeFreeze] },
    ),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([]),

    // Data stores
    DataRuntimeModule,
    DataFisherModule,

    // UI stores
    UiRuntimeModule,
    UiFisherModule,
  ],
  providers: [],
  declarations: [],
})
export class CoreStoreModule {}
