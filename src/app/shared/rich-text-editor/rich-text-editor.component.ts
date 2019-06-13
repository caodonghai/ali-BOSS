import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements OnInit, OnDestroy {
  @Input() InitialValue: string;
  @Input() Readonly: boolean;
  @Output() getContent = new EventEmitter<string>();

  isDestroy = false;

  public Editor = ClassicEditor;
  config = {
    language: 'zh-cn'
  };

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.isDestroy = true;
  }

  public onChange({editor}: ChangeEvent) {
    let data: string;
    try {
      data = editor.getData();
    } catch (e) {

    }
    this.getContent.emit(data);
  }

}
