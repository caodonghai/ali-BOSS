import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichTextEditorComponent} from './rich-text-editor/rich-text-editor.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [RichTextEditorComponent],
  imports: [
    CommonModule,
    CKEditorModule
  ],
  exports: [
    RichTextEditorComponent
  ]
})
export class SharedModule {
}
