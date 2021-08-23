import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';

import {ControlMessagesComponent} from './component/control-messages/control-messages.component';
import {DeleteComponent} from './component/delete/delete.component';
import {LoaderComponent} from './component/loader/loader.component';
import {FileUploadComponent} from './component/file-upload/file-upload.component';
import {SafePipe} from './pipes/safe.pipe';
import {HeaderComponent} from '../header/header.component';
import {FileDragNDropDirective} from './directives/file-drag-n-drop.directive';
import {CKEditorModule} from 'ckeditor4-angular';
import {SendMessagePopupComponent} from './component/send-message-popup/send-message-popup.component';
import {MyChallengesPopupComponent} from './component/my-challenges-popup/my-challenges-popup.component';
import { ImageRender } from './pipes/image-render.pipe';


@NgModule({
  declarations: [ControlMessagesComponent, DeleteComponent, LoaderComponent, FileUploadComponent, SafePipe,
    HeaderComponent, FileDragNDropDirective, SendMessagePopupComponent, MyChallengesPopupComponent, ImageRender],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CKEditorModule,
    NgbModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      autoDismiss: true,
      timeOut: 2000
    }),
  ],
  entryComponents: [
    DeleteComponent,
    FileUploadComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    DeleteComponent,
    SafePipe,
    ControlMessagesComponent,
    ImageRender,
    LoaderComponent,
    HeaderComponent,
    CKEditorModule,
    FileDragNDropDirective
  ],
  providers: []
})
export class SharedModule { }
