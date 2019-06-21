import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichTextEditorComponent} from './rich-text-editor/rich-text-editor.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import { FilterHtmlTagDirective } from './directive/filter-html-tag/filter-html-tag.directive';

@NgModule({
  declarations: [RichTextEditorComponent, FilterHtmlTagDirective],
  imports: [
    CommonModule,
    CKEditorModule
  ],
  exports: [
    RichTextEditorComponent,
    FilterHtmlTagDirective
  ]
})
export class SharedModule {
}
