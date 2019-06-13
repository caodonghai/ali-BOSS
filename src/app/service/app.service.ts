import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {
  }


  getMenu(): any[] {
    return [
      {id: '10', name: '首页', funcUrl: '/manage/home'},
      {id: '11', name: '租户管理', funcUrl: '/manage/tenant-manage'},
      {id: '12', name: '套餐管理', funcUrl: '/manage/package-manage'},
      {id: '13', name: '销售统计', funcUrl: '/manage/sales-statistics'},
      // {
      //   id: '15',
      //   name: '租户管理',
      //   children: [
      //     {id: '151', name: '技术支持信息修改'}
      //   ]
      // },
      {id: '16', name: '信息通知', funcUrl: '/manage/information-notice'},
      {id: '14', name: '信息反馈', funcUrl: '/manage/information-feedback'},
    ];
  }

  getUploadUrl(): string {
    return 'http://10.0.9.248:8081/ttIdea/upload';
  }

  uploadFile(formData: FormData) {
    const req = new HttpRequest('POST', 'http://10.0.9.248:8081/ttIdea/upload', formData, {
      reportProgress: true,
      withCredentials: false
    });
    return this.http.request(req);
  }
}

