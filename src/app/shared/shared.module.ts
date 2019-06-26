import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichTextEditorComponent} from './rich-text-editor/rich-text-editor.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import { FilterHtmlTagDirective } from './directive/filter-html-tag/filter-html-tag.directive';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { TreeModalComponent } from './tree-modal/tree-modal.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [RichTextEditorComponent, FilterHtmlTagDirective, TreeModalComponent],
  imports: [
    CommonModule,
    CKEditorModule,
    NgZorroAntdModule,
    FormsModule
  ],
  exports: [
    RichTextEditorComponent,
    TreeModalComponent,
    FilterHtmlTagDirective
  ]
})
export class SharedModule {
}
