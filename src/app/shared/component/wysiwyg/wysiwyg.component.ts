import { AfterViewInit, Component, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AngularEditorComponent, AngularEditorConfig } from '@kolkov/angular-editor';

import { WysiwygCustomButtonInterface } from '../../interface/wysiwyg-custom-button.interface';

@Component({
  selector: 'app-shared-wysiwyg',
  templateUrl: './wysiwyg.component.html',
  styleUrls: ['./wysiwyg.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WysiwygComponent),
    multi: true,
 }],
})
export class WysiwygComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  /**
   * Editor ID
   */
  @Input() id: string = '';

  /**
   * Input value
   */
  @Input() value: string = '';

  /**
   * Input placeholder
   */
  @Input() placeholder: string = '';

  /**
   * Value updatable on input change?
   */
  @Input() isUpdatableOnChange: boolean = true;

  /**
   * Is input editable ?
   */
  @Input() isEditable: boolean = true;

  /**
   * Is spell check required ?
   */
  @Input() isSpellCheck: boolean = true;

  /**
   * Show custom buttons?
   */
  @Input() showCustomButtons: boolean = true;

  /**
   * Input height
   */
  @Input() height: string;

  /**
   * Minimum input height
   */
  @Input() minHeight: string;

  /**
   * Error message
   */
  @Input() error: string = '';

  /**
   * Toolbar buttons to be activated
   * Supported options: Check 'availableButtons' definition
   */
  @Input() toolbarButtons: string[] = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'];

  /**
   * Changed value
   */
  @Output() changeValue: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Editor
   */
  @ViewChild(AngularEditorComponent, { static: true }) editor: AngularEditorComponent;

  /**
   * Editor config
  */
  editorConfig: AngularEditorConfig;

  /**
   * Class list for activating toolbar buttons
   */
  toolbarClassList: string;

  /**
   * Content copied from the input?
   */
  isCopied: boolean = false;

  /**
   * Content changed?
   */
  isChanged: boolean = false;

  /**
   * WYSIWYG CSS class
   */
  cssClass: string = '.rf__wysiwyg';

  /**
   * Available toolbar buttons
   */
  availableButtons: string[] = [
    'undo', 'redo', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'justifyLeft',
    'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent', 'insertUnorderedList', 'insertOrderedList',
    'heading', 'fontName', 'fontSize', 'textColor', 'backgroundColor', 'customClasses', 'link', 'unlink', 'insertImage',
    'insertVideo', 'insertHorizontalRule', 'removeFormat', 'toggleEditorMode',
  ];

  /**
   * Custom buttons config
   */
  customButtons: WysiwygCustomButtonInterface[] = [
    { placeholder: '*|TITLE|*', text: 'title', tooltip: 'tooltip_editor_insert_title' },
    { placeholder: '*|FIRSTNAME|*', text: 'label_first_name', tooltip: 'tooltip_editor_insert_firstname' },
    { placeholder: '*|LASTNAME|*', text: 'label_last_name', tooltip: 'tooltip_editor_insert_lastname' },
    { placeholder: '*|EMAIL|*', text: 'label_email', tooltip: 'tooltip_editor_insert_email' },
    { placeholder: '*|FOLLOW-UP|*', text: 'label_follow_up', tooltip: 'tooltip_editor_insert_followup' },
  ];

  /**
   * Editor specific methods
   */
  onChangeEditor: (element: HTMLElement) => void;
  refreshEditorView: (value: string) => void;

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.id = this.id || 'wysiwyg';

    this.editorConfig = {
      editable: this.isEditable,
      spellcheck: this.isSpellCheck,
      height: this.height,
      minHeight: this.minHeight,
      placeholder: this.placeholder,
      toolbarHiddenButtons: [this.availableButtons.filter(name => this.toolbarButtons.indexOf(name) === -1)],
    };

    this.toolbarClassList = this.toolbarButtons.map(b => b + '-active').join(' ');
  }

  /**
   * Completed initialization of component's view
   */
  ngAfterViewInit(): void {

    if (this.editor) {

      // Keep editor methods
      this.onChangeEditor = this.editor.onContentChange;
      this.refreshEditorView = this.editor.refreshView;

      // Assign custom methods
      this.editor.onContentChange = this.onContentChange.bind(this);
      this.editor.refreshView = this.render.bind(this);
    }
  }

  /**
   * @inheritDoc
   */
  writeValue(value: string): void {}

  /**
   * @inheritDoc
   */
  registerOnChange(fn: (v: Event) => void): void {}

  /**
   * @inheritDoc
   */
  registerOnTouched(fn: () => void): void {}

  /**
   * Focus on input
   */
  onFocus(): void {

    this.isCopied = false;
  }

  /**
   * Focusout event
   * (Angular editor's blur event does not work if clicked on non focusable elements)
   */
  @HostListener('focusout', ['$event'])
  onFocusout(event: MouseEvent): void {

    event.stopPropagation();

    const targetEl = event.target as HTMLElement;
    const relatedTargetEl = event.relatedTarget as HTMLElement;

    // Clicked on editor buttons
    if ((targetEl && targetEl.nodeName === 'BUTTON' && !!targetEl.closest(this.cssClass)) ||
      (relatedTargetEl && !!relatedTargetEl.closest(this.cssClass))) {

      return;
    }

    // Next cycle
    setTimeout(() => {

      // Reset
      this.isChanged = false;

      // Emit value change
      this.changeValue.emit(this.value);
    });
  }

  /**
   * Clicked on button to insert placeholder
   */
  onClickButtonPlaceholder(placeholder: string): void {

    this.insertPlaceholder(placeholder);
  }

  /**
   * Insert placeholder text at cursor position
   */
  insertPlaceholder(text: string): void {

    // Focus on the contenteditable
    this.editor.textArea.nativeElement.focus();

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    range.deleteContents();
    range.insertNode(document.createTextNode(text));

    // Render value in the editor
    this.render(this.editor.textArea.nativeElement.innerHTML);

    // Invoke content change
    this.onContentChange(this.editor.textArea.nativeElement);
  }

  /**
   * Copy on input
   */
  onCopy(): void {

    this.isCopied = true;
  }

  /**
   * Paste on input
   */
  onPaste(e: ClipboardEvent): void {

    // Copy/pasted from the input itself
    if (this.isCopied === true) {

      return;
    }

    e.preventDefault();

    const clipboardData = e.clipboardData || window['clipboardData'] || e['originalEvent'].clipboardData;

    // Get clipboard content as plain text
    const text = clipboardData && clipboardData.getData('text/plain') || '';

    // Insert text at the insertion point
    document.execCommand('insertText', false, text);

    this.isCopied = false;  // Reset
  }

  /**
   * Render value in the editor
   */
  private render(value: string): void {

    if (!this.isChanged) {

      this.refreshEditorView.call(this.editor, value);
    }

    // Reset
    this.isChanged = false;
  }

  /**
   * Content changed
   */
  private onContentChange(element: HTMLElement): void {

    this.isChanged = true;

    this.onChangeEditor.call(this.editor, element);

    if (this.isUpdatableOnChange === true) {

      this.changeValue.emit(this.value);
    }
  }
}
