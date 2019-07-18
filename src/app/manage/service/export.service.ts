import {Injectable} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ExportService {
  private tempUrl = 'http://10.0.9.201:8080/api';

  constructor(private msg: NzMessageService,
              private http: HttpClient) {
  }

  exportData(el, fileName: string, title: string) {
    const target = el.querySelectorAll('table')[0];
    const headContent = [];
    for (let i = 0; i < target.rows[0].cells.length; i++) {
      headContent.push(target.rows[0].cells[i].innerText);
    }
    const bodyContent = [];
    for (let i = 1; i < target.rows.length; i++) {
      const rowContent = [];
      for (let j = 0; j < target.rows[i].cells.length; j++) {
        rowContent.push(target.rows[i].cells[j].innerText);
      }
      bodyContent.push(rowContent);
    }
    const data = {
      body: bodyContent,
      head: headContent,
      fileName,
      title
    };
    return new Promise((resolve, reject) => {
      this.http.post(this.tempUrl + '/dataexport/excel/export', data, {
        responseType: 'blob'
      }).subscribe(res => {
        const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
        const reader = new FileReader();
        reader.onload = () => {
          try { // 可能会出现错误，需要进行捕获
            const downloadElement = document.createElement('a');
            const href = window.URL.createObjectURL(blob);
            downloadElement.href = href;
            downloadElement.download = fileName + '.xls';
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
            window.URL.revokeObjectURL(href);
          } catch (err) {

          }
          // if (reader.result.indexOf('\"resCode\":1') === -1) {
          //   this.msg.error('导出失败,请重试');
          // }
        };
        reader.readAsText(blob);
        resolve();
      });
    });
  }
}
