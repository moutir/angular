import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ListItemModel } from '../shared/list-item.model';
import { MultiselectSettingsInterface } from './multiselect-settings.interface';

export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiselectComponent),
  multi: true,
};
const noop = () => {
};

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR],
})

export class MultiselectComponent implements OnInit, ControlValueAccessor {

  @Input()
  data: Array<ListItemModel>;

  @Input()
  settings: MultiselectSettingsInterface;

  @Input()
  mainSelection: any;

  @Output('onSelect')
  onSelect: EventEmitter<ListItemModel> = new EventEmitter<ListItemModel>();

  @Output('onDeSelect')
  onDeSelect: EventEmitter<ListItemModel> = new EventEmitter<ListItemModel>();

  @Output('onSelectAll')
  onSelectAll: EventEmitter<ListItemModel> = new EventEmitter<ListItemModel>();

  selectedItems: Array<ListItemModel>;
  isActive = false;
  isSelectAll = false;
  filter = new ListItemModel();
  defaultSettings: MultiselectSettingsInterface = {
    singleSelection: false,
    text: 'label_select',
    multiSelectText: 'label_multiple_selected',
    enableCheckAll: true,
    selectAllText: 'label_multiselect_select_all',
    unSelectAllText: 'label_unselect_all',
    enableSearchFilter: false,
    maxHeight: 300,
  };

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.settings = Object.assign(this.defaultSettings, this.settings);
  }

  onItemClick(item: ListItemModel, index) {

    const found = this.isSelected(item);

    if (!found) {
      this.addSelected(item);
      this.onSelect.emit(item);
    } else {
      this.removeSelected(item);
      this.onDeSelect.emit(item);
    }

    if (this.isSelectAll) {
      this.isSelectAll = false;
    }
    if (this.data.length === this.selectedItems.length) {
      this.toggleSelectAll();
    }
    this.onChangeCallback(this.selectedItems);
  }

  writeValue(value: any) {
    if (value !== undefined && value !== null) {
      if (this.settings.singleSelection) {

        if (value.length > 1) {
          this.selectedItems = [value[0]];
        } else {

          this.selectedItems = value;
        }
      } else {
        this.selectedItems = value;
      }
    } else {
      this.selectedItems = [];
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  trackByFn(index, item) {
    return item.id;
  }

  isSelected(clickedItem: ListItemModel) {
    let found = false;
    this.selectedItems.forEach(item => {
      if (clickedItem.id === item.id) {
        found = true;
      }
    });
    return found;
  }

  addSelected(item: ListItemModel) {
    if (this.settings.singleSelection) {
      this.selectedItems = [];
      this.selectedItems.push(item);
    } else {
      this.selectedItems.push(item);
    }
  }

  removeSelected(clickedItem: ListItemModel) {
    this.selectedItems.forEach(item => {
      if (clickedItem.id === item.id) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      }
    });
    if (this.mainSelection && this.selectedItems.length === 0) {
      this.selectedItems.push(this.mainSelection);
    }
  }

  toggleDropdown() {
    this.isActive = !this.isActive;
  }

  closeDropdown() {
    this.isActive = false;
  }

  toggleSelectAll() {
    if (!this.isSelectAll) {
      this.selectedItems = [];
      this.selectedItems = this.data.slice();
      this.isSelectAll = true;
      this.onChangeCallback(this.selectedItems);
    } else {
      if (this.mainSelection) {
        this.isSelectAll = false;
        this.selectedItems = this.selectedItems.filter(item => {
          return item.id === this.mainSelection.id;
        });
      } else {
        this.isSelectAll = false;
      }
      this.onChangeCallback(this.selectedItems);
    }
    this.onSelectAll.emit();
  }
}
