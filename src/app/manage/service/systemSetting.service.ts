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

  // 获取用户信息
  getUserInfoById(id: string) {
    return this.http.get<Response>(this.tempUrl + '/uip/smUser/getById?id=' + id);
  }

  // 修改密码
  modifyPassword(params: any) {
    return this.http.put<Response>(this.tempUrl + '/uip//smUser/updatePassword', null, {params: params});
  }

  // 修改头像
  modifyAvatar(params: any) {
    return this.http.post<Response>(this.tempUrl + '/uip/smUser/updateById', null, {params: params});
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

  // 批量赋予用户角色
  batchGiveRole(params: any) {
    return this.http.post<Response>(this.tempUrl + '/uip/smUser/updateUserRoleByIds', null, {params: params});
  }

  // 根据id查找用户详情
  getUserDetailById(id: string) {
    return this.http.get<Response>(this.tempUrl + '/uip/smUser/getById?id=' + id);
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

  // 新增用户
  addUser(data) {
    return this.http.post<Response>(this.tempUrl + '/uip/smUser/addUser', data);
  }

  // 修改用户
  modifyUser(data) {
    return this.http.post<Response>(this.tempUrl + '/uip/smUser/updateById', data);
  }

  // 获取用户状态列表
  getUserStatusList() {
    return this.http.get<Response>(this.tempUrl + '/uip/common/getStates');
  }

  // 删除用户
  deleteUser(id: string) {
    return this.http.delete<Response>(this.tempUrl + '/uip/smUser/deleteById?id=' + id);
  }

  // 删除用户
  batchDeleteUser(idArray: string) {
    return this.http.delete<Response>(this.tempUrl + '/uip/smUser/deleteByIds?ids=' + idArray);
  }

  // 重置用户密码
  resetUserPassword(id: string) {
    return this.http.put<Response>(this.tempUrl + '/uip/smUser/resetPassword?id=' + id, null);
  }

  // 获取角色列表，带分页和查询条件
  getRoleListWithPaginationAndSearchCondition(params: any) {
    return this.http.get<Response>(this.tempUrl + '/uip/smRole/queryRoleList', {params: params});
  }

  // 启用或禁用角色
  disableOrEnableRoleById(params: any) {
    return this.http.put<Response>(this.tempUrl + '/uip/smRole/updateById', null, {params: params});
  }

  // 新增角色
  addRole(params: any) {
    return this.http.post<Response>(this.tempUrl + '/uip/smRole/addRole', null, {params: params});
  }

  // 修改角色
  modifyRole(params: any) {
    return this.http.put<Response>(this.tempUrl + '/uip/smRole/updateById', null, {params: params});
  }

  // 删除角色
  deleteRole(id: string) {
    return this.http.delete<Response>(this.tempUrl + '/uip/smRole/deleteById?id=' + id);
  }

  // 获取数据字典树
  getDataDictionaryTree() {
    return this.http.get<Response>(this.tempUrl + '/information/v1/dictionary/initTree');
  }

  // 获取app菜单树
  getAppMenuTreeList(params: any) {
    return this.http.get<Response>(this.tempUrl + '/uip/appFunction/queryAppFunctionTree', {params: params});
  }

  // 点击树形组件，加载该节点下的菜单列表
  getAppMenuListWithTreeParentCode(params: any) {
    return this.http.get<Response>(this.tempUrl + '/uip/appFunction/listAppFunctions', {params: params});
  }

  // 启用或禁用app功能
  editAppFunction(params: any) {
    return this.http.put<Response>(this.tempUrl + '/uip/appFunction/update', null, {params: params});
  }

  // 新增app功能菜单
  addAppFunction(params: any) {
    return this.http.post<Response>(this.tempUrl + '/uip/appFunction/add', null, {params: params});
  }

  // 删除APP功能次啊单
  deleteAppFuction(id: string) {
    return this.http.delete<Response>(this.tempUrl + '/uip/appFunction/delete?id=' + id);
  }
}
