import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

import { PropertySearchModel } from '../../shared/model/property-search.model';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { PropertySearchOptionsInterface } from '../../shared/interface/property-search-options.interface';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { ModalChoiceInterface } from '../../shared/interface/modal-choice.interface';
import { GeolocPolygonInterface } from '../../shared/interface/geoloc-polygon.interface';

@Component({
  selector: 'app-property-form-search',
  templateUrl: './property-form-search.component.html',
  styleUrls: ['./property-form-search.component.scss'],
})
export class PropertyFormSearchComponent extends FormComponentAbstract<
  PropertySearchModel,
  PropertySearchOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY_PROMOTION: EntityEnum[] = [EntityEnum.property, EntityEnum.promotion];
  readonly AUTOCOMPLETE_ENTITIES_LOCATION: EntityEnum[] = [EntityEnum.location];
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];

  /**
   * State observables
   */
  feature$: Observable<RuntimeFeatureInterface>;

  /**
   * Is the user searching for polygons ?
   */
  isSearchingPolygons: boolean = false;

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<PropertySearchModel>,
    protected runtimeService: RuntimeService,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete contact selection
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface): void {

    return this.setValue('contactId', selection.id);
  }

  /**
   * Changed autocomplete property/promotion selection
   */
  onChangeSelectionPropertyPromotion(selection: AutocompleteSelectionInterface): void {

    // Property
    if (selection.entity === EntityEnum.property) {

      const value = this.model.propertyIds.slice(0);
      value.push(selection.id);

      return this.setValue('propertyIds', value);
    }

    // Promotion
    if (selection.entity === EntityEnum.promotion) {

      const value = this.model.promotionIds.slice(0);
      value.push(selection.id);

      return this.setValue('promotionIds', value);
    }
  }

  /**
   * Changed autocomplete location selection
   */
  onChangeSelectionLocation(selection: AutocompleteSelectionInterface): void {

    const value = this.model.propertyIds.slice(0);
    value.push(selection.id);

    // Yes, it is updating the `propertyIds` input, you are not dreaming // TODO[nico] split this into locationIds
    return this.setValue('propertyIds', value);
  }

  /**
   * Clicked search polygons button
   */
  onClickSearchPolygon(): void {

    this.isSearchingPolygons = true;
  }

  /**
   * Submitted polygon modal
   */
  onSubmitModalPolygon(choice: ModalChoiceInterface<GeolocPolygonInterface[]>): void {

    this.isSearchingPolygons = false;

    // Cancelled
    if (choice.isValid !== true) {

      return;
    }

    // Update search polygons
    this.setValue('polygons', choice.data);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.feature$ = this.runtimeService.selectFeature();
  }
}
