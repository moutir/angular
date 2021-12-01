import { ContactModifyBrokerInterface } from '../../shared/interface/contact-modify-broker.interface';
import { ContactTransferInterface } from '../../shared/interface/contact-transfer.interface';
import { ContactTransferActivityInterface } from '../../shared/interface/contact-transfer-activity.interface';

export const FEATURE_NAME = 'ui-contact';

export interface UiContactStateInterface {

  // Preview by ID
  previewContactId: string;

  // IDs in the basket
  basketContactIds: string[];

  // Modify broker state
  modifyBroker: ContactModifyBrokerInterface;

  // Transfer state
  transfer: ContactTransferInterface;

  // Transfer activity state
  transferActivity: ContactTransferActivityInterface;

  // Is the profile form in advanced mode?
  isProfileFormAdvanced: boolean;
}

export const initialState: UiContactStateInterface = {
  previewContactId: '',
  basketContactIds: [],
  transfer: {
    agencyId: '',
    brokerId: '',
    contactIds: [],
  },
  modifyBroker: {
    contactIds: [],
    brokerId: '',
    rentalBrokerId: '',
    saleBrokerId: '',
    searchManagerId: '',
    specificContactId: '',
  },
  transferActivity: {
    contactId: '',
    brokerId: '',
    isAgreed: false,
    isActiveArchive: false,
    isAllowedArchive: false,
  },
  isProfileFormAdvanced: false,
};
