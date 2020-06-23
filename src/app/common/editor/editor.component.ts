import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ApplicationRef, ChangeDetectorRef, Compiler, Component, ComponentRef, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import * as $jquery from 'jquery';
import * as Quill from 'quill';
import { BaseComponent } from '../base.component';
import { Validator } from '../../util/validator';

const Delta = Quill.import('delta');

export const componentModuleName: string = 'CommonModule';
export const componentClassName: string = 'EditorComponent';
export const componentSelector: string = 'editor';
export const componentTemplateUrl: string = './editor.html';
export const componentStylesUrl: string[] = [];

@Component({
  selector: 'editor',
  templateUrl: 'editor.html',
  styles: ['editor.css']
})
export class EditorComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  quillEditor: any;
  quillEditorElement: HTMLElement;

  lastCursorPosition: number;

  @Input()
  emitter: EventEmitter<any>;

  @Input()
  staVisibleToolbar: boolean = false;

  @Input()
  staReadOnly: boolean = false;

  @Input()
  content: any;

  @Input()
  maxImageSize: number;

  @Output()
  blur: EventEmitter<any> = new EventEmitter();

  @Output()
  focus: EventEmitter<any> = new EventEmitter();

  @Output()
  ready: EventEmitter<any> = new EventEmitter();

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  // Confirm
  @Input()
  selectorConfirm: ViewContainerRef;

  public componentReferenceConfirm: ComponentRef<{}>;

  toolbarConfig: any;

  options: any;

  onModelChange: Function = () => { };
  onModelTouched: Function = () => { };

  constructor(
    private elementReference: ElementRef,
    private http: HttpClient,
    private compiler: Compiler,
    private applicationRef: ApplicationRef,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    viewContainerRef: ViewContainerRef,
    renderer: Renderer2,
    zone: NgZone,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(componentModuleName, componentClassName, componentSelector, viewContainerRef, renderer, zone, changeDetectorRef);
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (this.staVisibleToolbar) {
      this.toolbarConfig = [
        '#editor-toolbar',
        { font: ['sans-serif', 'serif', 'monospace'] },
        { size: ['8px', '10px', false, '16px', '18px', '24px', '28px', '32px'] },
        'bold',
        'italic',
        'underline',
        'strike',
        { align: '' },
        { align: 'center' },
        { align: 'right' },
        { align: 'justify' },
        { color: [] },
        { background: [] },
        { list: 'ordered' },
        { list: 'bullet' },
        { script: 'sub' },
        { script: 'super' },
        { indent: '-1' },
        { indent: '+1' },
        { direction: 'rtl' },
        { header: [1, 2, 3, 4, 5, 6, false] },
        'blockquote',
        'code-block',
        'link',
        'custompicture',
        'formula'
      ];
    } else {
      this.toolbarConfig = [];
    }

    this.options = {
      placeholder: '',
      modules: {
        toolbar: this.toolbarConfig,
      },
      theme: 'snow'
    };

    this.quillEditorElement = this.elementReference.nativeElement.children[0];

    this.quillEditor = new Quill(
      this.quillEditorElement,
      Object.assign(
        {
          readOnly: this.staReadOnly,
          theme: 'snow',
          boundary: document.body
        },
        this.options || {}
      )
    );

    this.quillEditor.enable(!this.staReadOnly);

    if (this.staReadOnly) {
      for (let idxChildren: number = 0; idxChildren < this.quillEditorElement.children.length; idxChildren++) {

        if (!Validator.isNullUndefined(this.quillEditorElement.children[idxChildren].attributes) &&
          this.quillEditorElement.children[idxChildren].attributes.length > 0 &&
          !Validator.isNullUndefined(this.quillEditorElement.children[idxChildren].attributes.getNamedItem('contenteditable'))) {

          this.quillEditorElement.children[idxChildren].attributes['contenteditable'].value = 'false';

          if (!Validator.isNullUndefined(this.quillEditorElement.children[idxChildren].children) &&
            !Validator.isNullUndefined(this.quillEditorElement.children[idxChildren].children.length)) {

            for (let idxSubChildren: number = 0; idxSubChildren < this.quillEditorElement.children[idxChildren].children.length; idxSubChildren++) {

              let htmlInputElement: HTMLInputElement = <HTMLInputElement>this.quillEditorElement.children[idxChildren];
              if (!Validator.isNullUndefined(htmlInputElement) &&
                htmlInputElement.type === 'text' &&
                htmlInputElement.readOnly !== true) {
                htmlInputElement.readOnly = true;
              }
            }
          }

        } else if (!Validator.isNullUndefined(this.quillEditorElement.children[idxChildren].children) &&
          !Validator.isNullUndefined(this.quillEditorElement.children[idxChildren].children.length)) {

          for (let idxSubChildren: number = 0; idxSubChildren < this.quillEditorElement.children[idxChildren].children.length; idxSubChildren++) {

            let htmlInputElement: HTMLInputElement = <HTMLInputElement>this.quillEditorElement.children[idxChildren].children[idxSubChildren];
            if (!Validator.isNullUndefined(htmlInputElement) &&
              htmlInputElement.type === 'text' &&
              htmlInputElement.readOnly !== true) {
              htmlInputElement.readOnly = true;
            }
          }
        }



      }
    }

    const quillToolbar: any = this.quillEditor.getModule('toolbar');
    quillToolbar.addHandler('custompicture', function () {
      console.log('custompicture');
    });

    const self = this;

    this.lastCursorPosition = 0;

    if (this.staVisibleToolbar === false && this.quillEditorElement.previousElementSibling.classList.contains('ql-toolbar')) {
      this.quillEditorElement.previousElementSibling.remove();
    }

    const sizeStyle: any = Quill.import('attributors/style/size');
    sizeStyle.whitelist = ['8px', '10px', '13px', '16px', '18px', '24px', '28px', '32px'];
    Quill.register(sizeStyle, true);

    if (this.content === undefined) {
      this.content = '';
    }

    if (this.maxImageSize === undefined) {
      this.maxImageSize = 40;
    }

    console.log('EditorComponent ==> ', this.maxImageSize);

    this.quillEditor.pasteHTML(this.content);

    this.collectQuillField(this.content, 'quillfield', 'field');

    this.ready.emit(this.quillEditor);

    this.quillEditor.on('selection-change', range => {
      if (!range) {
        this.onModelTouched();
        this.blur.emit(this.quillEditor);
      } else {
        this.focus.emit(this.quillEditor);
      }
    });

    if (this.staReadOnly !== true) {
      const self = this;

      this.quillEditor.on('text-change', (delta, oldDelta, source) => {
        let html = self.quillEditorElement.children[0].innerHTML;
        const text = self.quillEditor.getText();

        if (html === '<p><br></p>') {
          html = null;
        }

        this.onModelChange(html);

        this.change.emit({
          editor: self.quillEditor,
          html: html,
          text: text
        });
      });

      this.quillEditor.on('selection-change', (range, oldRange, source) => {
        if (range) {
          if (range.length === 0) {
            self.lastCursorPosition = range.index;
          } else {
            const text = self.quillEditor.getText(range.index, range.length);
          }
        }
      });

    }
  }

  ngOnDestroy() {
    if (!Validator.isNullUndefined($jquery('.quillimageresize'))) {
      $jquery('.quillimageresize').remove();
    }
    if (!Validator.isNullUndefined($jquery('.quillimagesizevalue'))) {
      $jquery('.quillimagesizevalue').remove();
    }
  }

  getFocus() {
    if (!Validator.isNullUndefined(this.quillEditor)) {
      this.quillEditor.focus();
    }
  }

  getTarget(e) {
    if (e.target) {
      return e.target;
    } else if (e.srcElement) {
      return e.srcElement;
    }
  }

  getCaretPosition(self, target: HTMLElement) {
    const element = self.quillEditorElement;
    let caretOffset = 0;
    const doc = element.ownerDocument || element.document;
    const win = doc.defaultView || doc.parentWindow;
    let sel;

    if (typeof win.getSelection !== 'undefined') {
      sel = win.getSelection();

      if (sel.rangeCount > 0) {
        const range = win.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != 'Control') {
      const textRange = sel.createRange();
      const preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      caretOffset = preCaretTextRange.text.length;
    }

    return caretOffset;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['readOnly'] && this.quillEditor) {
      this.quillEditor.enable(!changes['readOnly'].currentValue);
    }
  }

  writeValue(currentValue: any) {
    this.content = currentValue;

    if (this.quillEditor) {
      this.quillEditor.setText('');

      if (currentValue) {
        this.quillEditor.pasteHTML(currentValue);
        this.collectQuillField(this.content, 'quillfield', 'field');
        return;
      }
    }
  }

  writeNewLine(newLine: any, staAlignLeft: boolean = false) {
    if (this.quillEditor) {
      this.quillEditor.setSelection(this.quillEditor.getLength(), 0);
      this.quillEditor.updateContents({ ops: [{ insert: '\n' + newLine }] });
      if (staAlignLeft) {
        this.quillEditor.formatLine(1, 2, 'align', 'left');
      } else {
        this.quillEditor.formatLine(1, 2, 'align', 'right');
      }
    }
  }

  writeImage(newImage: any, staAlignLeft: boolean = false) {
    if (this.quillEditor) {
      this.quillEditor.setSelection(this.quillEditor.getLength(), 0);
      const img = '<br><a href="' + newImage + '"> <div> <img src="' + newImage + '" height="50"/> </div> </a>';
      this.quillEditor.clipboard.dangerouslyPasteHTML(0, img);
      if (staAlignLeft) {
        this.quillEditor.formatLine(1, 2, 'align', 'left');
      } else {
        this.quillEditor.formatLine(1, 2, 'align', 'right');
      }
    }
  }

  getContentPlainText(): string {
    const element: HTMLElement = <HTMLElement>this.quillEditorElement.firstElementChild;
    if (element !== undefined) {
      return element.innerText;
    } else {
      return '';
    }
  }

  getContentHTML(): string {
    const element: HTMLElement = <HTMLElement>this.quillEditorElement.firstElementChild;
    if (element !== undefined) {
      return element.innerHTML;
    } else {
      return '';
    }
  }

  collectQuillField(textContent: string, blotName: string, blotTagName: string) {
    let idxQuilfield: number = 0;

    const quillfieldArray: string[] = textContent.split(new RegExp('\\s*(<' + blotTagName + '[^>]*>|</' + blotTagName + '>)'));

    for (let idxQuilfieldArray: number = 0; idxQuilfieldArray < quillfieldArray.length; idxQuilfieldArray++) {
      if (
        idxQuilfieldArray + 2 <= quillfieldArray.length &&
        !Validator.isNullUndefined(quillfieldArray[idxQuilfieldArray]) &&
        !Validator.isNullUndefined(quillfieldArray[idxQuilfieldArray + 2]) &&
        quillfieldArray[idxQuilfieldArray].indexOf('<' + blotTagName) === 0 &&
        quillfieldArray[idxQuilfieldArray + 2].indexOf('</' + blotTagName) === 0
      ) {
        const quillfieldText = quillfieldArray[idxQuilfieldArray + 1];

        this.updateQuillInnerHTML(blotName, blotTagName, idxQuilfield, quillfieldText);

        idxQuilfield++;
      }
    }
  }

  updateQuillInnerHTML(blotName: string, tagName: string, tagIndex: number, tagValue: any) {
    const self = this;

    let idxQuilfield: number = -1;

    let startRange = 0;
    let returnRange;
    this.quillEditor.editor.delta.ops.forEach(function (item, index) {
      if (typeof item.insert === 'object') {
        const strItemBlot = JSON.stringify(item.insert);

        let staQuillTagFound: boolean;

        let tagValueQuillfield: string;

        const jsonValue = JSON.parse(strItemBlot, (key, value) => {
          if (key === blotName) {
            staQuillTagFound = true;
            idxQuilfield++;
            tagValueQuillfield = value.toString();
            return value;
          }

          return value;
        });

        if (staQuillTagFound === true && tagIndex === idxQuilfield) {
          const delta = new Delta().retain(startRange).delete(1);

          self.quillEditor.updateContents(delta);

          self.quillEditor.insertEmbed(startRange, 'quillfield', tagValue);

          returnRange = { startindex: startRange, length: tagValue.length };
        }

        startRange++;
      } else {
        startRange += item.insert.length;
      }
    });

    return returnRange;
  }

  registerOnChange(functionEvent: Function): void {
    this.onModelChange = functionEvent;
  }

  registerOnTouched(functionEvent: Function): void {
    this.onModelTouched = functionEvent;
  }
}
