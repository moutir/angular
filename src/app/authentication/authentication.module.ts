import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AuthenticationConfig } from './authentication.config';
import { AuthenticationStore } from './shared/authentication.store';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [],
  providers: [
    AuthenticationStore,
    AuthenticationConfig,
  ],
})
export class AuthenticationModule {

}
