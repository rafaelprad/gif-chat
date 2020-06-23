import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GifGridComponent } from './gif-grid/gif-grid.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './third-party/material.module';
import { PlatformModule } from '@angular/cdk/platform';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { AuthComponent } from './auth/auth.component';
import { EditorComponent } from './common/editor/editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    AuthComponent,
    ChatComponent,
    GifGridComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    PlatformModule,
    RouterModule,
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
