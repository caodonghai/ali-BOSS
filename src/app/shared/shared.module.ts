import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichTextEditorComponent} from './rich-text-editor/rich-text-editor.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {FilterHtmlTagDirective} from './directive/filter-html-tag/filter-html-tag.directive';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {TreeModalComponent} from './tree-modal/tree-modal.component';
import {FormsModule} from '@angular/forms';
import {BackButtonComponent} from './back-button/back-button.component';
import {DisplayOverflowContentDirective} from './directive/display-overflow-content/display-overflow-content.directive';

@NgModule({
  declarations: [
    RichTextEditorComponent,
    TreeModalComponent,
    BackButtonComponent,
    FilterHtmlTagDirective,
    DisplayOverflowContentDirective
  ],
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
    FilterHtmlTagDirective,
    DisplayOverflowContentDirective
  ]
})
export class SharedModule {
}
