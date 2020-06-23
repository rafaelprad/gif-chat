import { Component, OnInit, Compiler, ApplicationRef, ViewContainerRef, NgZone, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '../common/base.component';

export const componentModuleName: string = 'MainModule';
export const componentClassName: string = 'AuthComponent';
export const componentSelector: string = 'app-auth';
export const componentTemplateUrl: string = './auth.component.html';
export const componentStylesUrl: string[] = [];

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent extends BaseComponent {

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
  }

  onBtnEnter(): void {
    this.router.navigate(['/chat']);
  }
}
