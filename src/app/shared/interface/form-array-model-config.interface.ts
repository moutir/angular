import { ModelAbstract } from '../class/model.abstract';

export interface FormArrayModelConfigInterface {

  // Form array model's factory
  factory: () => ModelAbstract;

  // Optional form array model's attributes that act as radio buttons but are checkboxes (limitation of Angular Material...)
  radioCheckboxes?: string[];
}
