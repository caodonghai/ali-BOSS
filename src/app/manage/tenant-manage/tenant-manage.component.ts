import {Component, OnInit} from '@angular/core';
import {ManageService} from '../service/manage.service';
import {calculateExpiredTime, formatDateTime} from '../../../util/formatDate';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-tenant-manage',
  templateUrl: './tenant-manage.component.html',
  styleUrls: ['./tenant-manage.component.css']
})
export class TenantManageComponent implements OnInit {
  productList: any[];
  tenantList: any[] = [];
  name = ''; // 租户名称
  productName: string = null;
  status = '1'; // 状态 1 - 全部 2-正常 3-过期
  buyTime = [];
  startTime = '';
  endTime = '';
  pageSize = 10;
  pageNumber = 1;
  total = 1;
  loading = false;
  selected: any = {};
  isDetailModalVisible = false;

  constructor(private manageService: ManageService, private msg: NzMessageService) {
  }

  ngOnInit() {
    this.manageService.getProductList().subscribe(res => {
      this.productList = res.data;
    });
    this.getTenantList();
  }

  handleDateChange(result): void {
    if (result.length === 0) {
      this.startTime = '';
      this.endTime = '';
    } else {
      this.startTime = formatDateTime(result[0]);
      this.endTime = formatDateTime(result[1]);
    }
  }

  getTenantList(): void {
    this.loading = true;
    const params = {
      name: this.name,
      status: this.status ? this.status : '',
      productName: this.productName ? this.productName : '',
      startTime: this.startTime,
      endTime: this.endTime,
      pageSize: this.pageSize,
      pageNumber: this.pageNumber
    };
    this.manageService.getTenantList(params).subscribe(res => {
      this.tenantList = this.handleData(res.data.list);
      this.total = res.data.total;
      this.loading = false;
    });
  }

  resetSearchCondition() {
    this.status = '1';
    this.startTime = '';
    this.endTime = '';
    this.buyTime = [];
    this.productName = '';
    this.name = '';
  }

  handleData(list: any[]): any[] {
    return list.map(item => {
      item.buyTime = item.buyTime.split('.')[0];
      item.expiredOn = item.expiredOn.split('.')[0];
      item.rest = parseInt(item.accountQuantity) - parseInt(item.accountQuantityInUserd);
      item.restDay = calculateExpiredTime(item.expiredOn);
      return item;
    });
  }

  handleTableClick(e) {
    const method = e.target.dataset.method;
    const id = e.target.dataset.id;
    if (method && id) {
      this.selected = this.tenantList.find(item => item.id === id);
      if (method === 'detail') {
        this.isDetailModalVisible = true;
      } else if (method === 'enable') {
        this.enable();
      } else if (method === 'disable') {
        this.disable();
      }
    }
  }

  enable() {
    const params = {
      id: this.selected.id,
      enable: 1
    };
    this.manageService.enableTenant(params).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('启用成功');
        this.getTenantList();
      }
    });
  }

  disable() {
    const params = {
      id: this.selected.id,
      enable: 2
    };
    this.manageService.enableTenant(params).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('禁用成功');
        this.getTenantList();
      }
    });
  }
}
