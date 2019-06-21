import {Injectable} from '@angular/core';
import {Response} from '../../interface';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingService {
  private tempUrl = 'http://10.0.9.201:8080/api';

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

  // 修改菜单状态
  modifyMenuStatus(params: any) {
    return this.http.put<Response>(this.tempUrl + '/uip/smMenu/updateById', null, {params: params});
  }

  // 上移菜单
  moveUpMenu(params: any) {
    return this.http.put<Response>(this.tempUrl + '/uip/smMenu/moveUpMenu', null, {params: params});
  }

  // 下一菜单
  moveDownMenu(params: any) {
    return this.http.put<Response>(this.tempUrl + '/uip/smMenu/moveDownMenu', null, {params: params});
  }

  // 删除菜单
  deleteMenu(params) {
    return this.http.delete<Response>(this.tempUrl + '/uip/smMenu/deleteById', {params: params});
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

  // 获取角色列表
  getRoleList() {
    return this.http.get<Response>(this.tempUrl + '/uip/smRole/queryRoleList?pageNumber=-1&pageSize=-1');
  }

  // 根据角色获取权限树
  getPermissionByRoleId(id: string) {
    return this.http.get<Response>(this.tempUrl + '/uip/smAuthority/queryAuthorityRoleList?roleId=' + id);
  }
}
