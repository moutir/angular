import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule, MatListModule, MatSidenavModule, MatSlideToggleModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import 'hammerjs';
import { MatStepperModule } from '@angular/material/stepper';

import { SmartDatePipe } from './pipe/smart-date.pipe';
import { InitialsPipe } from './pipe/initials.pipe';
import { ForLoopPipe } from './pipe/for-loop.pipe';
import { MenuComponent } from './component/menu/menu.component';
import { SelectionBarComponent } from './component/selection-bar/selection-bar.component';
import { AutocompleteComponent } from './component/autocomplete/autocomplete.component';
import { KeywordsComponent } from './component/keywords/keywords.component';
import { AreaUnitPipe } from './pipe/area-unit.pipe';
import { SmartTimestampPipe } from './pipe/smart-timestamp.pipe';
import { AsyncImageDirective } from './directive/async-image.directive';
import { ContextualDirective } from './directive/contextual.directive';
import { PreviewContactComponent } from './component/preview-contact/preview-contact.component';
import { DatetimePipe } from './pipe/datetime.pipe';
import { SvgIconComponent } from './component/svg-icon/svg-icon.component';
import { WysiwygComponent } from './component/wysiwyg/wysiwyg.component';
import { AppConfig } from '../app.config';
import { ContextualComponent } from './component/contextual/contextual.component';
import { PreviewImageComponent } from './component/preview-image/preview-image.component';
import { CardPropertyComponent } from './component/card-property/card-property.component';
import { CardContactComponent } from './component/card-contact/card-contact.component';
import { PreviewPropertyComponent } from './component/preview-property/preview-property.component';
import { PreviewPromotionComponent } from './component/preview-promotion/preview-promotion.component';
import { CardPromotionComponent } from './component/card-promotion/card-promotion.component';
import { NotificationModule } from '../notification/notification.module';
import { MapModule } from '../map/map.module';
import { ModalModule } from '../modal/modal.module';
import { CaptchaModule } from '../captcha/captcha.module';
import { ClipboardModule } from '../clipboard/clipboard.module';
import { AddressModule } from '../address/address.module';
import { NumberModule } from '../number/number.module';
import { FrequencyUnitPipe } from './pipe/frequency-unit.pipe';
import { MoreIconComponent } from './component/more-icon/more-icon.component';
import { PageHeaderComponent } from './component/page-header/page-header.component';
import { HistoryPanelComponent } from './component/history-panel/history-panel.component';
import { ContactLinkComponent } from './component/contact-link/contact-link.component';
import { SwitzerlandStrategy } from './strategy/date-adapter/switzerland.strategy';
import { UploadComponent } from './component/upload/upload.component';
import { UploadStatusBarComponent } from './component/upload-status-bar/upload-status-bar.component';
import { AvatarComponent } from './component/avatar/avatar.component';
import { LocationPipe } from './pipe/location.pipe';
import { InputPasswordDirective } from './directive/input-password.directive';
import { InputTimeDirective } from './directive/input-time.directive';
import { RestrictionLinkComponent } from './component/restriction-link/restriction-link.component';
import { PreviewRestrictionComponent } from './component/preview-restriction/preview-restriction.component';
import { RestrictionRuleComponent } from './component/restriction-rule/restriction-rule.component';
import { GeneralErrorComponent } from './component/general-error/general-error.component';
import { JoinPipe } from './pipe/join.pipe';
import { ColorPickerModule } from '../realforce/color-picker.module';
import { InputChipListComponent } from './component/input-chip-list/input-chip-list.component';
import { StarsComponent } from './component/stars/stars.component';
import { ProgressIconComponent } from './component/progress-icon/progress-icon.component';
import { YesNoComponent } from './component/yes-no/yes-no.component';
import { UploadImageComponent } from './component/upload-image/upload-image.component';
import { AbsoluteUrlPipe } from './pipe/absolute-url.pipe';
import { CostPerLeadPipe } from './pipe/cost-per-lead.pipe';
import { MonthYearPickerComponent } from './component/month-year-picker/month-year-picker.component';
import { YearPickerComponent } from './component/year-picker/year-picker.component';
import { AccountFormRequiredComponent } from './component/account-form-required/account-form-required.component';
import { AccountPrivilegesComponent } from './component/account-privileges/account-privileges.component';
import { ContactFormRequiredComponent } from './component/contact-form-required/contact-form-required.component';

/**
 * @IMPORTANT Only import/export "dumb" components, no dependency to any feature module allowed!
 */
@NgModule({
  imports: [

    // Modules required by a shared component or pipe
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule,

    // Material modules
    MatIconModule,
    MatProgressBarModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatBadgeModule,
    MatSlideToggleModule,
    DragDropModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatSliderModule,
    MatStepperModule,
    MatButtonToggleModule,

    // Highcharts
    ChartModule,

    // Realforce modules
    NotificationModule,
    ModalModule,
    MapModule,
    CaptchaModule,
    AddressModule,
    NumberModule,
    ClipboardModule,
    ColorPickerModule,
  ],
  declarations: [

    // Components
    SvgIconComponent,
    MenuComponent,
    SelectionBarComponent,
    AutocompleteComponent,
    KeywordsComponent,
    WysiwygComponent,
    PreviewImageComponent,
    ContextualComponent,
    CardContactComponent,
    CardPropertyComponent,
    CardPromotionComponent,
    PreviewContactComponent,
    PreviewPropertyComponent,
    PreviewPromotionComponent,
    MoreIconComponent,
    PageHeaderComponent,
    HistoryPanelComponent,
    ContactLinkComponent,
    UploadComponent,
    UploadStatusBarComponent,
    AvatarComponent,
    RestrictionLinkComponent,
    RestrictionRuleComponent,
    PreviewRestrictionComponent,
    GeneralErrorComponent,
    InputChipListComponent,
    StarsComponent,
    ProgressIconComponent,
    YesNoComponent,
    UploadImageComponent,
    MonthYearPickerComponent,
    YearPickerComponent,
    AccountFormRequiredComponent,
    AccountPrivilegesComponent,
    ContactFormRequiredComponent,

    // Directives
    AsyncImageDirective,
    ContextualDirective,
    InputTimeDirective,
    InputPasswordDirective,
    InputTimeDirective,

    // Pipes
    DatetimePipe,
    SmartDatePipe,
    SmartTimestampPipe,
    InitialsPipe,
    ForLoopPipe,
    AreaUnitPipe,
    FrequencyUnitPipe,
    LocationPipe,
    JoinPipe,
    AbsoluteUrlPipe,
    CostPerLeadPipe,
  ],
  exports: [

    // Shared modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,

    // Shared components
    SvgIconComponent,
    MenuComponent,
    SelectionBarComponent,
    AutocompleteComponent,
    KeywordsComponent,
    PreviewContactComponent,
    WysiwygComponent,
    ContextualComponent,
    PreviewImageComponent,
    CardPropertyComponent,
    CardContactComponent,
    CardPromotionComponent,
    PreviewPropertyComponent,
    PreviewPromotionComponent,
    MoreIconComponent,
    PageHeaderComponent,
    HistoryPanelComponent,
    ContactLinkComponent,
    UploadComponent,
    UploadStatusBarComponent,
    AvatarComponent,
    RestrictionLinkComponent,
    RestrictionRuleComponent,
    PreviewRestrictionComponent,
    GeneralErrorComponent,
    InputChipListComponent,
    StarsComponent,
    ProgressIconComponent,
    YesNoComponent,
    UploadImageComponent,
    MonthYearPickerComponent,
    YearPickerComponent,
    AccountFormRequiredComponent,
    AccountPrivilegesComponent,
    ContactFormRequiredComponent,

    // Shared directives
    AsyncImageDirective,
    ContextualDirective,
    InputTimeDirective,
    InputPasswordDirective,
    InputTimeDirective,

    // Shared pipes
    DatetimePipe,
    SmartDatePipe,
    SmartTimestampPipe,
    InitialsPipe,
    ForLoopPipe,
    AreaUnitPipe,
    FrequencyUnitPipe,
    LocationPipe,
    JoinPipe,
    AbsoluteUrlPipe,
    CostPerLeadPipe,

    // Material modules
    MatIconModule,
    MatProgressBarModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatBadgeModule,
    MatSlideToggleModule,
    DragDropModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatSliderModule,
    MatStepperModule,
    MatButtonToggleModule,

    // Highcharts
    ChartModule,

    // Realforce modules
    NotificationModule,
    ModalModule,
    MapModule,
    CaptchaModule,
    AddressModule,
    NumberModule,
    ColorPickerModule,
  ],
  providers: [
    DatetimePipe,
    DatePipe,
    {
      // TODO[later] Refactor once language switch done on Angular, will have problem with lazy loaded modules
      provide: MAT_DATE_LOCALE,
      deps: [AppConfig],
      useFactory: (appConfig: AppConfig) => {

        const locale: {[language: string]: string} = {
          en: 'en-GB',
          fr: 'fr-CH',
          de: 'de-CH',
        };

        return locale[appConfig.languageCurrent] || locale[appConfig.languageDefault];
      },
    },
    {
      provide: DateAdapter,
      useClass: SwitzerlandStrategy,
    },
    {
      provide: HIGHCHARTS_MODULES,
      useFactory: () => [],
    },
  ],
})
export class SharedModule {}
