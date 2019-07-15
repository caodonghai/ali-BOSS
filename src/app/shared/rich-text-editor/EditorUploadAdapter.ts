import {HttpEventType} from '@angular/common/http';

class EditorUploadAdapter {
  private loader;
  private editor;
  private appService;

  constructor(loader, editor) {
    this.loader = loader;
    this.editor = editor;
    this.appService = this.editor.config.get('appService');
  }

  async upload() {
    const data = new FormData();
    data.append('files', await this.loader.file);
    return new Promise((resolve, reject) => {
      this.appService.uploadFileReturnURl(data).subscribe(res => {
        if (res.type === HttpEventType.Response) {
          if (res.body.resCode === 1) {
            resolve({default: this.appService.getFileUrl() + res.body.data[0]});
          }
        }
      });
    });
  }
}

export function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new EditorUploadAdapter(loader, editor);
  };
}
