import {Injectable} from '@angular/core';
import {Response} from '../../interface';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingService {
  private tempUrl = 'http://hezhangzhi.net/api';

  constructor(private http: HttpClient) {
  }

  // 获取菜单列表，用于树形组件
  getMenuTreeList() {
    return this.http.get<Response>(this.tempUrl + '/uip/smMenu/queryMenuTree');
  }

  // 获取菜单列表，用于表格
  getMenuList(params: any) {
    return this.http.get<Response>(this.tempUrl + '/uip/smMenu/queryMenuList', {params: params});
  }

  // 获取模块功能树
  getModuleTree() {
    return this.http.get<Response>(this.tempUrl + '/uip/serviceFunction/queryFunctionTree');
  }

  // 获取菜单树，用于新增菜单
  getMenuTree() {
    return this.http.get<Response>(this.tempUrl + '/uip/smMenu/queryMenuTreeByAppId');
  }

  // 新增菜单时，保存菜单
  saveMenu(data) {
    return this.http.post<Response>(this.tempUrl + '/uip/smMenu/saveMenuTree', data);
  }
}
