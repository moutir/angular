import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { SharedModule } from './shared/shared.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { LayoutModule } from './layout/layout.module';
import { CoreStoreModule } from './core-store/core-store.module';
import { ApiModule } from './api/api.module';
import { RuntimeModule } from './runtime/runtime.module';
import { TranslationModule } from './translation/translation.module';
import { RemoteTranslationLoaderStrategy } from './translation/shared/translation-loader/remote-translation-loader.strategy';
import { RemoteDataProviderStrategy } from './runtime/shared/data-provider/remote-data-provider.strategy';
import { RuntimeDataProvider } from './runtime/shared/runtime-data-provider';
import { ContactElementsModule } from '../elements/contact-elements.module';
import { PromotionElementsModule } from '../elements/promotion-elements.module';
import { PropertyElementsModule } from '../elements/property-elements.module';
import { DocumentModule } from './document/document.module';
import { GalleryModule } from './gallery/gallery.module';
import { ContactSearchElementsModule } from '../elements/contact-search-elements.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: RemoteTranslationLoaderStrategy,
      },
    }),
    CoreModule.forRoot(),
    CoreStoreModule,
    ApiModule,
    RuntimeModule.forRoot({
      dataProvider: {
        provide: RuntimeDataProvider,
        useClass: RemoteDataProviderStrategy,
      },
    }),
    TranslationModule,
    AppRoutingModule,
    SharedModule,
    LayoutModule,
    AuthenticationModule,
    PropertyElementsModule,
    ContactElementsModule,
    PromotionElementsModule,
    ContactSearchElementsModule,
    DocumentModule,
    GalleryModule,
  ],
  providers: [
    AppConfig,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
