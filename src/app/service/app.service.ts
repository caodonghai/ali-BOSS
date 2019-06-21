import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {BASE_URL} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private uploadUrl = BASE_URL + '/boss/ttIdea/upload';
  private fileUrl = 'http://10.0.9.253:8080';

  private menuList = [
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
        {id: '172', name: '角色权限', funcUrl: '/manage/system-setting/role-permission'}
      ]
    },
  ];

  constructor(private http: HttpClient) {
  }

  getMenu(): any[] {
    return this.menuList;
  }

  uploadFile(formData: FormData) {
    const req = new HttpRequest('POST', this.uploadUrl, formData, {
      reportProgress: true,
      withCredentials: false
    });
    return this.http.request(req);
  }

  getFileUrl(): string {
    return this.fileUrl;
  }
}

