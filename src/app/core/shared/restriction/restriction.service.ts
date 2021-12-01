import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, map } from 'rxjs/operators';

import { RestrictionConfig } from './restriction.config';
import { RestrictionModel } from '../../../shared/model/restriction.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { RestrictionSearchModel } from '../../../shared/model/restriction-search.model';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';
import { RestrictionApiService } from '../../../api/shared/restriction/restriction-api.service';
import { RestrictionEventRemove } from '../../../core-store/ui-restriction/actions/restriction-event-remove';
import { selectDataRestriction } from '../../../core-store/data-restriction/selectors';
import { PositionInterface } from '../../../shared/interface/position.interface';
import { RestrictionEventPreview } from '../../../core-store/ui-restriction/actions/restriction-event-preview';
import { selectUiPreviewRestriction } from '../../../core-store/ui-restriction/selectors';

@Injectable()
export class RestrictionService extends ModelServiceAbstract<RestrictionModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private moduleConfig: RestrictionConfig,
    private restrictionApiService: RestrictionApiService,
    private legacyParserService: LegacyParserService,
    private ngZone: NgZone,
  ) {

    super();
  }

  /**
   * Select restriction to preview
   */
  selectPreviewRestriction(): Observable<RestrictionModel|null> {

    return this.store$.select(selectUiPreviewRestriction);
  }

  /**
   * @inheritDoc
   */
  factory(): RestrictionModel {

    return new RestrictionModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<RestrictionModel|null> {

    return this.store$.select(selectDataRestriction(id));
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<RestrictionModel> {

    return this
      .restrictionApiService
      .load(id);
  }

  /**
   * @inheritDoc
   */
  save(model: RestrictionModel): Observable<ModelSaveInterface> {

    return this
      .restrictionApiService
      .save(model)
      .pipe(
        map(response => this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING)),
        catchError(response => of(
          this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
        )),
      );
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: RestrictionSearchModel,
  ): Observable<ModelListInterface<RestrictionModel>> {

    return this.restrictionApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  remove(id: string): void {

    this.store$.dispatch(
      new RestrictionEventRemove({ id: id }),
    );
  }

  /**
   * Preview a restriction at the given position
   */
  preview(id: string, position: PositionInterface): void {

    // TODO[later] Remove NgZone usage once fully on Angular
    this.ngZone.run(() => {

      this.store$.dispatch(
        new RestrictionEventPreview({
          restrictionId: id,
          position: position,
        }),
      );
    });
  }
}
