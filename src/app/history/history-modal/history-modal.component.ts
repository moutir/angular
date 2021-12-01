import { Component, Input, OnInit } from '@angular/core';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { HistoryInterface } from '../../shared/interface/history.interface';
import { HistoryModel } from '../../shared/model/history.model';
import { HistoryService } from '../../core/shared/history/history.service';
import { ExportTypeEnum } from '../../shared/enum/export-type.enum';

@Component({
  selector: 'app-history-modal',
  templateUrl: './history-modal.component.html',
  styleUrls: ['./history-modal.component.scss'],
})
export class HistoryModalComponent extends ModalComponentAbstract<HistoryInterface> implements OnInit {

  /**
   * History state
   */
  @Input() history: HistoryInterface;

  /**
   * History models
   */
  @Input() histories: HistoryModel[] = [];

  /**
   * Header title label (considered NOT translated)
   */
  @Input() labelTitle: string;

  /**
   * Export actions
   */
  exportActionSummary: ExportTypeEnum = ExportTypeEnum.summary;
  exportActionFull: ExportTypeEnum = ExportTypeEnum.full;

  /**
   * Constructor
   */
  constructor(
    private historyService: HistoryService,
  ) {

    super();
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

  }

  /**
   * Track by model ID
   */
  trackById(index: number, model: HistoryModel): string {

    return model.id;
  }

  /**
   * Clicked on export action
   */
  onClickExport(type: ExportTypeEnum): void {

    this.historyService.export(type, this.history.entity, this.history.entityId);
  }
}
