import { Component, OnInit, ViewChild, EventEmitter, Compiler, ApplicationRef, ViewContainerRef, Renderer2, NgZone, ChangeDetectorRef } from '@angular/core';
import { IMessage } from '../model/imessage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validator } from '../util/validator';
import { EditorComponent, componentModuleName, componentClassName, componentSelector } from '../common/editor/editor.component';
import { BaseComponent } from '../common/base.component';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends BaseComponent {

  currentChat: string;

  message: IMessage;

  formChat: FormGroup;

  staShowGifGrid: boolean = false;

  staReloadContent: boolean = false;

  emitterGifGrid: EventEmitter<string>;

  lastChatContent: any;

  lastGifUrlSelected: string;

  @ViewChild('editorChat')
  editorChat: EditorComponent;

  constructor(
    private http: HttpClient,
    private compiler: Compiler,
    private applicationRef: ApplicationRef,
    private router: Router,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    viewContainerRef: ViewContainerRef,
    renderer: Renderer2,
    zone: NgZone,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(componentModuleName, componentClassName, componentSelector, viewContainerRef, renderer, zone, changeDetectorRef);

    this.resetMessage();

    this.initGifGridEmitter();
  }

  ngOnInit(): void {

  }

  createFormChat() {
    this.formChat = new FormGroup({
      messageText: new FormControl('', Validators.required)
    });
  }

  initGifGridEmitter() {
    this.emitterGifGrid = new EventEmitter();
    this.emitterGifGrid.subscribe((value) => {
      this.staShowGifGrid = false;
      this.staReloadContent = true;
      if (!Validator.isNullUndefinedEmpty(value)) {
        this.lastGifUrlSelected = value;
      }
      this.render();
    });
  }

  resetMessage() {
    this.message = <IMessage>{};

    this.createFormChat();
  }

  reloadContent() {
    if (!Validator.isNullUndefined(this.editorChat)) {

      this.staReloadContent = false;
      this.editorChat.writeValue(this.lastChatContent);

      if (!Validator.isNullUndefinedEmpty(this.lastGifUrlSelected)) {
        this.editorChat.writeImage(this.lastGifUrlSelected)
        this.editorChat.writeNewLine('This is a premade hardcode text', true);
        this.lastGifUrlSelected = undefined;
      }
    }
  }

  onBtnGifSearch(): void {
    this.lastChatContent = this.editorChat.getContentHTML();
    this.staShowGifGrid = true;
  }

  onBtnSend(): void {
    this.writeMessage();
  }

  onBtnClose(): void {
    this.router.navigate(['/auth']);
  }

  writeMessage() {
    if (!Validator.isNullUndefinedEmpty(this.message.text)) {
      this.editorChat.writeNewLine(this.message.text);
      this.editorChat.writeNewLine('This is a premade hardcode text', true);
      this.resetMessage();
    }
  }

  canShowGifGrid(): boolean {
    if (this.staReloadContent == true &&
      this.staShowGifGrid == false) {
      this.reloadContent();
    }
    return this.staShowGifGrid;
  }
}
