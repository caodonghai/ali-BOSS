import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() {
  }


  getMenu(): any[] {
    return [
      {id: '10', name: '首页', funcUrl: '/manage/home'},
      {id: '11', name: '租户管理', funcUrl: '/manage/tenant-manage'},
      {id: '12', name: '套餐管理', funcUrl: '/manage/package-manage'},
      {id: '13', name: '销售统计'},
      {
        id: '15',
        name: '租户管理',
        children: [
          {id: '151', name: '技术支持信息修改'}
        ]
      },
      {id: '16', name: '信息通知'},
      {id: '14', name: '信息反馈', funcUrl: '/manage/information-feedback'},
    ];
  }
}

