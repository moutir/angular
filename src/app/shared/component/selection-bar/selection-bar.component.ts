import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ListSelectionInterface } from '../../interface/list-selection.interface';
import { ModelAbstract } from '../../class/model.abstract';
import { PositionInterface } from '../../interface/position.interface';
import { EntityEnum } from '../../enum/entity.enum';

@Component({
  selector: 'app-shared-selection-bar',
  templateUrl: './selection-bar.component.html',
  styleUrls: ['./selection-bar.component.scss'],
})
export class SelectionBarComponent implements OnChanges {

  /**
   * Is the component only using the "more" icon ?
   */
  @Input() isUsingOnlyMoreIcon: boolean = true;

  /**
   * Button label
   */
  @Input() buttonLabel: string = 'label_action_on_selection';

  /**
   * Button icon
   *
   * @deprecated Going to disappear with new UX TODO[nico]
   */
  @Input() buttonIcon: string = 'keyboard_arrow_down';

  /**
   * Selection
   */
  @Input() selection: ListSelectionInterface|null = null;

  /**
   * Sentence to display if no selection
   */
  @Input() noSelectionSentence: string = '';

  /**
   * Models available (selected or not)
   */
  @Input() models: ModelAbstract[];

  /**
   * Total number of records
   */
  @Input() total: number;

  /**
   * Entity name
   */
  @Input() entity: EntityEnum;

  /**
   * Is the component loading ?
   */
  @Input() isLoading: boolean;

  /**
   * Is the component selection text active ?
   */
  @Input() isActiveSelectionText: boolean = true;

  /**
   * Is the component selection all link active ?
   */
  @Input() isActiveSelectionAll: boolean = true;

  /**
   * Is the component selection action button active ?
   */
  @Input() isActiveAction: boolean = true;

  /**
   * Clicked the select action button
   */
  @Output() clickSelectAction: EventEmitter<PositionInterface> = new EventEmitter<PositionInterface>();

  /**
   * Clicked the select all button
   */
  @Output() clickSelectAll: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Clicked the select none button
   */
  @Output() clickSelectNone: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Translation key used for found results count, Ex: 'label_count_property_found_plural'
   */
  countFoundTranslationKey: string = '';

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.total || changes.entity) {

      // Generate results translation key
      this.countFoundTranslationKey = 'label_count_{entity}_found_{mode}'
        .replace('{entity}', this.entity)
        .replace('{mode}', this.total > 1 ? 'plural' : 'singular');
    }
  }

  /**
   * Clicked the select action button
   */
  onClickSelectAction(event: MouseEvent): void {

    event.preventDefault();
    event.stopPropagation();

    this.clickSelectAction.emit({
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Clicked the select all button
   */
  onClickSelectAll(): void {

    this.clickSelectAll.emit();
  }

  /**
   * Clicked the select none button
   */
  onClickSelectNone(): void {

    this.clickSelectNone.emit();
  }
}
