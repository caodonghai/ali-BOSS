import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular';
import {NavigationStart, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

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
  config = {
    language: 'zh-cn'
  };

  constructor(private router: Router, private el: ElementRef) {
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
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(
        () => {
          e.ui.destroy();
        }
      );
  }
}
