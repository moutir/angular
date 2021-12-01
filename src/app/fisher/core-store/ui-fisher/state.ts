import { FisherInterface } from '../../shared/interface/fisher.interface';

export const FEATURE_NAME = 'ui-fisher';

export interface UiFisherStateInterface {
  form: FisherInterface;
}

export const initialState: UiFisherStateInterface = {
  form: {
    step: 0,
    addressInfo: {
      address: {
        string: '',
        street: '',
        houseNumber: '',
        zipCode: '',
        city: '',
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
    },
    locationInfo: {
      street: '',
      houseNumber: '',
      zipCode: '',
      city: '',
      coordinates: {
        lat: 46,
        lng: 7,
      },
    },
    propertyInfo: {
      category: '',
      subCategory: '',
      livingArea: null,
      landArea: null,
      year: null,
      floor: null,
      rooms: null,
      bathrooms: null,
      state: '',
    },
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      address1: '',
      address2: '',
      zip: '',
      city: '',
      country: '',
      motivation: '',
      recaptcha: '',
      language: '',
    },
  },
};
