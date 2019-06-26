import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichTextEditorComponent} from './rich-text-editor/rich-text-editor.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import { FilterHtmlTagDirective } from './directive/filter-html-tag/filter-html-tag.directive';
import { ChooseRegionComponent } from './choose-region/choose-region.component';
import {NzModalModule} from 'ng-zorro-antd';

@NgModule({
  declarations: [RichTextEditorComponent, FilterHtmlTagDirective, ChooseRegionComponent],
  imports: [
    CommonModule,
    CKEditorModule,
    NzModalModule
  ],
  exports: [
    RichTextEditorComponent,
    ChooseRegionComponent,
    FilterHtmlTagDirective
  ]
})
export class SharedModule {
}
