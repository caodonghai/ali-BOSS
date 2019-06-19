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
      {id: '10', name: '首页', funcUrl: '/manage/home', icon: 'area-chart'},
      {id: '11', name: '租户管理', funcUrl: '/manage/tenant-manage', icon: 'team'},
      {id: '12', name: '套餐管理', funcUrl: '/manage/package-manage', icon: 'appstore'},
      // {id: '13', name: '销售统计', funcUrl: '/manage/sales-statistics'},
      {id: '16', name: '信息通知', funcUrl: '/manage/information-notice', icon: 'notification'},
      {id: '14', name: '信息反馈', funcUrl: '/manage/information-feedback', icon: 'form'},
      {
        id: '17',
        name: '系统设置',
        funcUrl: '/manage/system-setting',
        icon: 'setting',
        children: [
          {id: '171', name: '菜单设置', funcUrl: '/manage/system-setting/menu-setting'},
          {id: '172', name: '用户设置', funcUrl: '/manage/system-setting/user-setting'},
          {id: '173', name: '权限设置', funcUrl: '/manage/system-setting/permission-setting'},
        ]
      },
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

  getFileUrl(): string {
    return 'http://10.0.9.253:8080';
  }
}

