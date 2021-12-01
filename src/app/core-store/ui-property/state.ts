import { PropertyTransferInterface } from '../../shared/interface/property-transfer.interface';
import { PropertyPublicationInterface } from '../../shared/interface/property-publication.interface';
import { PropertyBrochureMenuInterface } from '../../shared/interface/property-brochure-menu.interface';
import { PropertyMortgageInterface } from '../../shared/interface/property-mortgage.interface';
import { PropertyValuationInterface } from '../../shared/interface/property-valuation.interface';
import { PropertyBrochureInterface } from '../../shared/interface/property-brochure.interface';
import { BrochureQualityEnum } from '../../shared/enum/brochure-quality.enum';
import { LanguageEnum } from '../../shared/enum/language.enum';

export const FEATURE_NAME = 'ui-property';

export interface UiPropertyStateInterface {

  // Preview by ID
  previewPropertyId: string;

  // IDs in the basket
  basketPropertyIds: string[];

  // Transfer state
  transfer: PropertyTransferInterface;

  // Publication state
  publication: PropertyPublicationInterface;

  // Brochure menu state
  brochureMenu: PropertyBrochureMenuInterface;

  // Mortgage state
  mortgage: PropertyMortgageInterface;

  // Valuation state
  valuation: PropertyValuationInterface;

  // Brochure state
  brochure: PropertyBrochureInterface;
}

export const initialState: UiPropertyStateInterface = {
  previewPropertyId: '',
  basketPropertyIds: [],
  transfer: {
    agencyId: '',
    brokerId: '',
    propertyIds: [],
  },
  publication: {
    propertyIds: [],
    websites: {
      changes: {},
      dates: {
        from: null,
        to: null,
      },
    },
    portals: {
      changes: {},
      dates: {
        from: null,
        to: null,
      },
    },
  },
  brochureMenu: {
    propertyId: '',
    position: {
      x: 0,
      y: 0,
    },
  },
  mortgage: {
    step: 0,
    propertyId: '',
    contactId: '',
    query: '',
  },
  valuation: {
    step: 0,
    propertyId: '',
    link: '',
  },
  brochure: {
    step: 0,
    propertyId: '',
    typeId: null,
    type: null,
    privacyId: null,
    privacy: null,
    quality: BrochureQualityEnum.email,
    language: LanguageEnum.en,
    brokerId: null,
  },
};
