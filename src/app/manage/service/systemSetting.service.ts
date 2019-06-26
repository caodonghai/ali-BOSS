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

  // 授权
  authorizeRole(params: any) {
    return this.http.post<Response>(this.tempUrl + '/uip/smAuthority/authorizedRole', null, {params: params});
  }

  // 获取菜单树，用于菜单权限
  getAuthorizeMenuTree() {
    return this.http.get<Response>(this.tempUrl + '/uip/smAuthority/queryUserAuthorizedRoleList?pageSize=-1&pageNumber=-1');
  }

  // 根据roleId获取菜单树,获取的是所有权限树，包括未选中的
  getMenuTreeByRoleId(params: any) {
    return this.http.get<Response>(this.tempUrl + '/uip/smAuthority/queryAuthorityMenuTree', {params: params});
  }

  // 根据roleId获取选中的菜单树
  getCheckedMenuTreeByRoleId(params: any) {
    return this.http.get<Response>(this.tempUrl + '/uip/smAuthority/queryAuthorityMenuTreeDetail', {params: params});
  }

  // 给角色授权菜单
  authorizeMenu(params: any) {
    return this.http.post<Response>(this.tempUrl + '/uip/smAuthority/authorizedMenu', null, {params: params});
  }

  // 获取用户列表
  getUserList(params: any) {
    return this.http.get<Response>(this.tempUrl + '/uip/smUser/queryUserListByRegion', {params: params});
  }

  // 给用户赋予角色
  giveRole(params: any) {
    return this.http.post<Response>(this.tempUrl + '/uip/smUser/updateUserRoleByIds', null, {params: params});
  }

  // 判断用户名是否存在
  checkUserNameExist(userName: string) {
    return this.http.get<Response>(this.tempUrl + '/uip/common/checkUserNameExist?userName=' + userName);
  }

  // 获取用户密码提示信息以及验证的正则表达式
  getCheckPasswordInfo() {
    return this.http.get<Response>(this.tempUrl + '/uip/common/getPasswordStrength');
  }

  // 验证手机号码是否已经注册
  checkCellphoneExist(cellphone: string) {
    return this.http.get<Response>(this.tempUrl + '/uip/common/checkCellphoneExist?cellphone=' + cellphone);
  }

  // 获取区域树权限树等各种树
  getTree(url) {
    return this.http.get<Response>(url);
  }
}
