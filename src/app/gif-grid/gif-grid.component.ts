import { Component, OnInit, Compiler, ApplicationRef, ViewContainerRef, Renderer2, NgZone, ChangeDetectorRef, Input, HostListener } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AppConfig } from '../config/app-config';
import { EventEmitter } from 'protractor';
import { Validator } from '../util/validator';

export const GIF_MIN_WIDTH: number = 100;
export const GIF_MIN_HEIGTH: number = 100;

export const componentModuleName: string = 'MainModule';
export const componentClassName: string = 'GifGridComponent';
export const componentSelector: string = 'gif-grid';
export const componentTemplateUrl: string = './gif-grid.component.html';
export const componentStylesUrl: string[] = [];

@Component({
  selector: 'gif-grid',
  templateUrl: './gif-grid.component.html',
  styleUrls: ['./gif-grid.component.scss']
})
export class GifGridComponent extends BaseComponent {

  numMaxGifPageItems: number = 5;

  idxPageGifPageItens: number = 0;
  idxGifPageItems: number = 0;

  numPageEnd: number = 0;

  giphies = [];

  listaGifPage: [];

  gifSearch: string;

  numClientLastWidth: number;
  numClientLastHeight: number;

  @Input()
  emitter: EventEmitter;

  // Window Size

  @HostListener('window:resize', ['$event'])
  sizeWindow(event) {
    this.numClientLastWidth = event.target.innerWidth;
    this.numClientLastHeight = event.target.innerHeight;

    this.loadPageItens();
  }

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
  }

  ngOnInit(): void {

    this.idxGifPageItems = 0;

    this.loadPageItens();

    this.resizePageItens();
  }

  resizePageItens() {
    this.numClientLastWidth = this.viewContainerRef.element.nativeElement.parentElement.clientWidth;
    this.numClientLastHeight = this.viewContainerRef.element.nativeElement.parentElement.clientHeight;

    let numMinGifWidth: number = this.numClientLastWidth / 2;

    if (numMinGifWidth < GIF_MIN_WIDTH) {
      numMinGifWidth = GIF_MIN_WIDTH;
    }

    let numMaxItemsWidth: number = Math.abs(Math.floor(this.numClientLastWidth / numMinGifWidth));

    if (numMaxItemsWidth <= 0) {
      numMaxItemsWidth = 1;
    }

    let numMaxItemsHeight: number = Math.abs(Math.floor(this.numClientLastHeight / GIF_MIN_HEIGTH));

    if (numMaxItemsHeight <= 0) {
      numMaxItemsHeight = 1;
    }

    this.numMaxGifPageItems = numMaxItemsWidth * numMaxItemsHeight;
  }

  getPreviousGifPage(): void {
    if (this.idxPageGifPageItens > 0) {
      this.idxPageGifPageItens--;
      this.idxGifPageItems = this.idxPageGifPageItens * this.numMaxGifPageItems;
    }

    this.loadPageItens(false);
  }

  getPreviousGifPageState(): boolean {
    let result: boolean = false;
    if (this.idxPageGifPageItens > 0 && this.idxPageGifPageItens > 0) {
      result = true;
    }
    return !result;
  }

  getNextGifPage(): void {
    if (this.idxPageGifPageItens * this.numMaxGifPageItems + this.numMaxGifPageItems < this.giphies.length) {
      this.idxPageGifPageItens++;
      this.idxGifPageItems = this.idxGifPageItems * this.numMaxGifPageItems;
    }

    this.loadPageItens(false);
  }

  getNextGifPageState(): boolean {
    let result: boolean = false;
    if (Validator.isArrayWithItems(this.giphies) &&
      this.idxPageGifPageItens * this.numMaxGifPageItems + this.numMaxGifPageItems < this.giphies.length
    ) {
      result = true;
    }
    return !result;
  }

  loadPageItens(staResetIdxPageGifPage: boolean = true) {

    this.resizePageItens();

    const listaGifPage_: [] = [];

    if (Validator.isArrayWithItems(this.giphies)) {
      for (
        let idxGifPageItem = this.idxPageGifPageItens * this.numMaxGifPageItems;
        idxGifPageItem < this.giphies.length && idxGifPageItem - this.idxPageGifPageItens * this.numMaxGifPageItems < this.numMaxGifPageItems;
        idxGifPageItem++
      ) {
        listaGifPage_.push((<[]>this.giphies)[idxGifPageItem]);
      }
    }

    this.listaGifPage = listaGifPage_;

    if (staResetIdxPageGifPage) {
      this.idxGifPageItems = 0;
    }
  }

  getDescriptionQty(): string {
    return 'Total: ' + this.giphies.length;
  }

  getDescriptionPage(): string {
    const numPageStart: number = this.idxPageGifPageItens + 1;
    this.numPageEnd = Math.abs(Math.floor(this.giphies.length / this.numMaxGifPageItems));
    if (this.numPageEnd === 0) {
      this.numPageEnd = 1;
    } else if (this.giphies.length % this.numMaxGifPageItems > 0) {
      this.numPageEnd++;
    }

    if (!isNaN(this.numPageEnd)) {
      this.numPageEnd = numPageStart;
    }

    return numPageStart + ' of ' + this.numMaxGifPageItems;
  }

  onBtnSearch(): void {
    const apiLink = AppConfig.strGifServerApi + this.gifSearch;

    this.http.get(apiLink)
      .subscribe((res: Response) => {
        this.giphies = (<any>res).data;
        if (Validator.isNullUndefined(this.giphies)) {
          this.giphies = [];
        }

        this.loadPageItens();

      });
  }

  onSendGifItem(gifUrl: string): void {
    this.emitter.emit(gifUrl);
  }

  onBtnCloseSearch(): void {
    this.emitter.emit('');
  }
}
