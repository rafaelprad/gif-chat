import { ChangeDetectorRef, Compiler, ComponentFactory, ComponentRef, ElementRef, HostListener, Input, ModuleWithComponentFactories, NgZone, QueryList, Renderer2, ViewChildren, ViewContainerRef } from '@angular/core';
import { Validator } from '../util/validator';

export const GET_COMPONENT_MODULE_NAME = 'getComponentModuleName';

export const STR_ERROR_BOLD_START: string = '<b>';

export const STR_ERROR_BOLD_END: string = '</b>';

export const STR_ERROR_NEWLINE: string = '<br>';

const STR_ERROR_MODULE: string = 'Módulo';

const STR_ERROR_METHOD: string = 'Método';

const STR_ERROR_DETAIL: string = 'Detalhe';

const STR_ERROR_SERVICE: string = 'Erro no serviço';

const STR_ERROR_SERVICE_DETAIL_DEFAULT: string = 'Não foi possível obter detalhes do erro.';

const STR_ERROR_WARNING: string = 'Aviso';

const STR_ERROR_SERVICE_DETAIL_AUTOLOGOFF: string = 'O sistema fechará automaticamente a conexão.';

declare var System: any;

declare var $: any;
declare var Materialize: any;

export class BaseComponent {
  protected staSecurityApplied: boolean;

  protected staComponentDynamic: boolean = false;

  get ModuleName(): string {
    return this.moduleName;
  }

  set ModuleName(moduleName_: string) {
    this.moduleName = moduleName_;
  }

  get ComponentName(): string {
    return this.componentName;
  }

  set ComponentName(componentName_: string) {
    this.componentName = componentName_;
  }

  get ComponentSelector(): string {
    return this.componentSelector;
  }

  set ComponentSelector(componentSelector_: string) {
    this.componentSelector = componentSelector_;
  }

  get self(): any {
    return this;
  }

  @Input()
  parent: any;

  constructor(
    public moduleName: string,
    private componentName: string,
    private componentSelector: string,
    protected viewContainerRef: ViewContainerRef,
    protected renderer: Renderer2,
    protected zone: NgZone,
    protected changeDetectorRef: ChangeDetectorRef
  ) { }

  // Validator
  keyRestrictCharWithNumber(event: KeyboardEvent, staCanUseSpace: boolean = false) {
    let keycode = 0;
    if (window.event) {
      keycode = event.keyCode; // IE
    } else {
      keycode = event.which; // Firefox
    }

    if ((keycode > 47 && keycode < 58) ||
      (keycode > 63 && keycode < 91) ||
      (keycode > 96 && keycode < 123) ||
      event.code === "Home" || event.code === "End" ||
      event.code === "Delete" ||
      event.code === "ArrowLeft" || event.code === "ArrowRight" ||
      event.code === "Numpad0" || event.code === "Numpad1" ||
      event.code === "Numpad2" || event.code === "Numpad3" ||
      event.code === "Numpad4" || event.code === "Numpad5" ||
      event.code === "Numpad6" || event.code === "Numpad7" ||
      event.code === "Numpad8" || event.code === "Numpad9" ||
      keycode === 8 || keycode === 9 || keycode === 127 ||
      event.key === '-' || event.key === '.' ||
      (staCanUseSpace === true && keycode === 32) ||
      (event.key === 'Ç' || event.key === 'ç' || event.key === '@' || event.key === '_' || event.key === '-') ||
      (event.ctrlKey && (event.key === 'C' || event.key === 'c' || event.key === 'V' || event.key === 'v'))) {
      return true;
    } else {
      return false;
    }
  }

  render(): void {
    if (!Validator.isNullUndefined(this.zone)) {
      this.zone.run(() => {
        this.changeDetectorRef.detectChanges();
      });
    }
  }

}
