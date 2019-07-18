import {Injectable} from '@angular/core';
import {BASE_URL} from '../../../environments/environment';
import {Response} from '../../interface';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ManageService {

  constructor(private http: HttpClient) {
  }

  // 获取地区租户数量
  getRegionTenantAmount() {
    return this.http.get<Response>(BASE_URL + '/boss/ttSubscibe/listRegionTenantNumber');
  }

  // 获取租户占比
  getProductPercent() {
    return this.http.get<Response>(BASE_URL + '/boss/ttSpecification/listTenantSpecification');
  }

  // 获取租户列表
  getTenantList(params?: any) {
    return this.http.get<Response>(BASE_URL + '/boss/ttSubscibe/list', {params: params});
  }

  // 获取套餐列表
  getProductList() {
    return this.http.get<Response>(BASE_URL + '/boss/ttSpecification/listProductName');
  }

  // 启用租户
  enableTenant(params?: any) {
    return this.http.put<Response>(BASE_URL + '/boss/ttSubscibe/updateEnable', null, {params: params});
  }

  // 获取套餐管理列表
  getProductManageList(params?: any) {
    return this.http.get<Response>(BASE_URL + '/boss/ttSpecification/list', {params: params});
  }

  // 新增套餐
  addProduct(params) {
    return this.http.post<Response>(BASE_URL + '/boss/ttSpecification/add', null, {params: params});
  }

  // 编辑套餐
  editProduct(params) {
    return this.http.put<Response>(BASE_URL + '/boss/ttSpecification/update', null, {params: params});
  }

  // 删除套餐
  deleteProduct(params?: any) {
    return this.http.delete<Response>(BASE_URL + '/boss/ttSpecification/delete', {params: params});
  }

  // 获取套餐用户列表
  getProductUserList(params: any) {
    return this.http.get<Response>(BASE_URL + '/boss/ttSpecification/listTenant', {params: params});
  }

  // 获取产品列表
  getProductOptionList(params?: any) {
    return this.http.get<Response>(BASE_URL + '/boss/ttProduct/list', {params: params});
  }

  // 获取信息通知列表
  getInformationNoticeList(params: any) {
    return this.http.get<Response>(BASE_URL + '/boss/ttInform/list', {params: params});
  }

  // 通过产品名称获取租户
  getTenantListByProductName(params: any) {
    return this.http.get<Response>(`${BASE_URL}/boss/ttInform/listTenant`, {params: params});
  }

  // 新增一条信息通知
  addInformationNotice(params) {
    return this.http.post<Response>(BASE_URL + '/boss/ttInform/add', null, {params: params});
  }

  // 撤回一条通知
  recallInformationNotice(params) {
    return this.http.put<Response>(BASE_URL + '/boss/ttInform/updateStatus', null, {params: params});
  }

  // 删除一条信息通知
  deleteInformationNotice(params) {
    return this.http.delete<Response>(BASE_URL + '/boss/ttInform/delete', {params: params});
  }

  // 获取信息反馈列表
  getInformationFeedbackList(params: any) {
    return this.http.get<Response>(BASE_URL + '/boss/ttIdeaReply/list', {params: params});
  }

  // 删除一条信息反馈
  deleteInformationFeedback(params: any) {
    return this.http.delete<Response>(BASE_URL + '/boss/ttIdeaReply/delete', {params: params});
  }

  // 答复信息反馈
  replyInformationFeedback(params: any) {
    return this.http.post<Response>(BASE_URL + '/boss/ttIdeaReply/add', null, {params: params});
  }
}
