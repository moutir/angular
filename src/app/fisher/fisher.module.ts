import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';

import { FisherModalComponent } from './fisher-modal/fisher-modal.component';
import { FisherComponent } from './fisher.component';
import { FisherConfig } from './fisher.config';
import { CoreStoreModule } from './core-store/core-store.module';
import { NotificationModule } from '../notification/notification.module';
import { ModalModule } from '../modal/modal.module';
import { MapModule } from '../map/map.module';
import { CaptchaModule } from '../captcha/captcha.module';
import { BrowserService } from '../core/shared/browser/browser.service';
import { BrowserServiceFactory } from '../core/shared/browser/browser-service.factory';
import { LocalStorageService } from '../core/shared/storage/local-storage.service';
import { SessionStorageService } from '../core/shared/storage/session-storage.service';
import { SessionStorageServiceFactory } from '../core/shared/storage/session-storage-service.factory';
import { LocalStorageServiceFactory } from '../core/shared/storage/local-storage-service.factory';
import { AddressModule } from '../address/address.module';
import { RuntimeDataProvider } from '../runtime/shared/runtime-data-provider';
import { RuntimeModule } from '../runtime/runtime.module';
import { TranslationModule } from '../translation/translation.module';
import { ConfigDataProviderStrategy } from '../runtime/shared/data-provider/config-data-provider.strategy';
import { FisherService } from './shared/fisher.service';
import { ConfigTranslationLoaderStrategy } from '../translation/shared/translation-loader/config-translation-loader.strategy';
import { NumberModule } from '../number/number.module';
import { FisherModalFooterComponent } from './fisher-modal-footer/fisher-modal-footer.component';
import { FisherApiService } from './shared/fisher-api.service';
import { PhalconHttpService } from '../api/http/phalcon-http.service';
import { ConfirmService } from '../core/shared/confirm.service';

@NgModule({
  declarations: [

    // Components
    FisherComponent,
    FisherModalComponent,
    FisherModalFooterComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: ConfigTranslationLoaderStrategy,
      },
    }),
    RouterModule.forRoot([{ path: '**',  component: FisherComponent }]),
    CoreStoreModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

    // Material modules
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatStepperModule,

    // Realforce modules
    NotificationModule,
    ModalModule,
    MapModule,
    CaptchaModule,
    AddressModule,
    RuntimeModule.forRoot({
      dataProvider: {
        provide: RuntimeDataProvider,
        useClass: ConfigDataProviderStrategy,
      },
    }),
    TranslationModule,
    NumberModule,
  ],
  providers: [
    PhalconHttpService,
    FisherConfig,
    FisherApiService,
    FisherService,
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: BrowserService, useFactory: BrowserServiceFactory },
    { provide: LocalStorageService, useFactory: LocalStorageServiceFactory, deps: [BrowserService] },
    { provide: SessionStorageService, useFactory: SessionStorageServiceFactory, deps: [BrowserService] },
    ConfirmService,
  ],
  bootstrap: [FisherComponent],
})
export class FisherModule { }
