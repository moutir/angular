import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { StateInterface } from '../../../core-store/state.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { HistoryEventOpen } from '../../../core-store/ui-history/actions/history-event-open';
import { HistoryInterface } from '../../../shared/interface/history.interface';
import { HistoryModel } from '../../../shared/model/history.model';
import { selectUiHistory, selectUiModels } from '../../../core-store/ui-history/selectors';
import { HistoryUpdateHistory } from '../../../core-store/ui-history/actions/history-update-history';
import { HistoryEventExport } from '../../../core-store/ui-history/actions/history-event-export';
import { ExportTypeEnum } from '../../../shared/enum/export-type.enum';

@Injectable()
export class HistoryService {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
  ) {

  }

  /**
   * Select history state
   */
  selectHistory(): Observable<HistoryInterface> {

    return this.store$.select(selectUiHistory);
  }

  /**
   * Select history models
   */
  selectHistoryModels(): Observable<HistoryModel[]> {

    return this.store$.select(selectUiModels);
  }

  /**
   * Export entity
   */
  export(type: ExportTypeEnum, entity: EntityEnum, entityId: string): void {

    this.store$.dispatch(
      new HistoryEventExport({
        type,
        entity,
        entityId,
      }),
    );
  }

  /**
   * Open history modal
   */
  openModal(entity: EntityEnum, id: string, label: string): void {

    this.store$.dispatch(
      new HistoryEventOpen({
        entity,
        entityId: id,
        entityLabel: label,
      }),
    );
  }

  /**
   * Close history modal
   */
  closeModal(): void {

    this.store$.dispatch(
      new HistoryUpdateHistory({
        history: {
          entity: null,
          entityId: '',
          entityLabel: '',
        },
      }),
    );
  }
}
