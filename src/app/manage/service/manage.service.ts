import {Injectable} from '@angular/core';
import {BASE_URL} from '../../../config';
import {Response} from '../../interface';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageService {

  constructor(private http: HttpClient) {
  }

  // 获取租户列表
  getTenantList(params?: any) {
    return this.http.get<Response>(BASE_URL + '/ttSubscibe/list', {params: params});
  }

  // 获取套餐列表
  getProductList() {
    return this.http.get<Response>(BASE_URL + '/ttSpecification/listProductName');
  }

  // 启用租户
  enableTenant(params?: any) {
    return this.http.put<Response>(BASE_URL + '/ttSubscibe/updateEnable', null, {params: params});
  }

  // 获取套餐管理列表
  getProductManageList(params?: any) {
    return this.http.get<Response>(BASE_URL + '/ttSpecification/list', {params: params});
  }

  // 新增套餐
  addProduct(params) {
    return this.http.post<Response>(BASE_URL + '/ttSpecification/add', null, {params: params});
  }

  // 编辑套餐
  editProduct(params) {
    return this.http.put<Response>(BASE_URL + '/ttSpecification/update', null, {params: params});
  }

  // 删除套餐
  deleteProduct(params?: any) {
    return this.http.delete<Response>(BASE_URL + '/ttSpecification/delete', {params: params});
  }

  // 获取套餐用户列表
  getProductUserList(params: any) {
    return this.http.get<Response>(BASE_URL + '/ttSpecification/listTenant', {params: params});
  }

  // 获取产品列表
  getProductOptionList(params?: any) {
    return this.http.get<Response>(BASE_URL + '/ttProduct/list', {params: params});
  }
}
