import { FrequencyEnum } from '../enum/frequency.enum';

export interface RuntimeFeaturePriceInterface {

  // Frequency mapping
  frequency: {[frequencyId: string]: FrequencyEnum};
}
