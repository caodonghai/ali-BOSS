import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular';
import {CustomUploadAdapterPlugin} from './EditorUploadAdapter';
import {AppService} from '../../service/app.service';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements OnInit, OnDestroy {
  @Input() InitialValue: string;
  @Input() Readonly: boolean;
  @Input() show: boolean;
  @Output() getContent = new EventEmitter<string>();

  Editor = ClassicEditor;
  config: any;

  private instance;

  constructor(private appService: AppService) {
    this.config = {
      language: 'zh-cn',
      appService,
      extraPlugins: [CustomUploadAdapterPlugin]
    };
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.getContent.unsubscribe();
  }

  onChange({editor}: ChangeEvent) {
    let data: string;
    data = editor.getData();
    this.getContent.emit(data);
  }

  onReady(e) {
    this.instance = e;
  }
}
