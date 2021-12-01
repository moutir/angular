import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FolderModel } from '../shared/folder.model';

/**
 * @deprecated Do not re-use this component until it is cleaned up (no 'any', no DOM manipulation)
 */
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnChanges {

  /**
   * List of folders
   */
  @Input() folders: {
    [key: string]: FolderModel;
  };

  /**
   * Current folder ID
   */
  @Input() folderId: string;

  /**
   * Clicked on folder, emit folderId
   */
  @Output() clickFolder: EventEmitter<string> = new EventEmitter();

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    // Changed folders
    if (changes.folders) {

      // For each folder
      Object
        .keys(this.folders)
        .filter(name => typeof this.folders[name] === 'object')
        .forEach(name => {

          // Has subfolder if at least one key is an object (weird I know...)
          this.folders[name].hasSubFolder = Object
            .keys(this.folders[name])
            .some(key => typeof this.folders[name][key] === 'object');
        });
    }
  }

  /**
   * Clicked an expand button
   */
  onClickExpand(event: Event): void {

    // TODO[later] forbidden to play with the DOM in a component!

    const element = <HTMLElement>(event.currentTarget);

    if (element.parentElement.parentElement.querySelector('.submenu').classList.contains('hidden-menu')) {

      element.parentElement.parentElement.querySelector('.submenu').classList.remove('hidden-menu');
      element.classList.remove('fa-chevron-right');
      element.classList.add('fa-chevron-down');

    } else {

      element.parentElement.parentElement.querySelector('.submenu').classList.add('hidden-menu');
      element.classList.remove('fa-chevron-down');
      element.classList.add('fa-chevron-right');
    }

    event.cancelBubble = true;
  }

  /**
   * Clicked on a folder
   */
  onClickFolder(folderId: string, event: Event): void {

    event.stopPropagation();

    // TODO[later] forbidden to play with the DOM in a component!

    if (document.querySelector('.activeFolder') && document.querySelector('.activeFolder').classList.length > 0) {
      document.querySelector('.activeFolder').classList.remove('activeFolder');
    }
    (<HTMLElement>event.currentTarget).classList.add('activeFolder');

    // Emit event
    this.clickFolder.emit(folderId);
  }

  /**
   * Clicked on a folder
   */
  onClickSubFolder(folderId: string) {

    this.clickFolder.emit(folderId);
  }
}
