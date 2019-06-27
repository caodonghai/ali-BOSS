import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichTextEditorComponent} from './rich-text-editor/rich-text-editor.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import { FilterHtmlTagDirective } from './directive/filter-html-tag/filter-html-tag.directive';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { TreeModalComponent } from './tree-modal/tree-modal.component';
import {FormsModule} from '@angular/forms';
import { BackButtonComponent } from './back-button/back-button.component';

@NgModule({
  declarations: [RichTextEditorComponent, FilterHtmlTagDirective, TreeModalComponent, BackButtonComponent],
  imports: [
    CommonModule,
    CKEditorModule,
    NgZorroAntdModule,
    FormsModule
  ],
  exports: [
    RichTextEditorComponent,
    TreeModalComponent,
    BackButtonComponent,
    FilterHtmlTagDirective
  ]
})
export class SharedModule {
}
