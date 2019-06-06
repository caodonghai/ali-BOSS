import {Component, OnInit} from '@angular/core';
import {ManageService} from '../service/manage.service';
import {formatDateTime} from '../../../util/formatDate';

@Component({
  selector: 'app-tenant-manage',
  templateUrl: './tenant-manage.component.html',
  styleUrls: ['./tenant-manage.component.css']
})
export class TenantManageComponent implements OnInit {
  productList: any[];
  tenantList: any[];
  name: string; // 租户名称
  status = '1'; // 状态 1 - 全部 2-正常 3-过期
  buyTime = [];
  startTime: string;
  endTime: string;

  constructor(private manageService: ManageService) {
  }

  ngOnInit() {
    this.manageService.getProductList().subscribe(res => {
      this.productList = res.data.list;
    });
  }

  handleDateChange(result): void {
    if (result.length === 0) {
      this.startTime = '';
      this.endTime = '';
    } else {
      this.startTime = formatDateTime(result[0]);
      this.endTime = formatDateTime(result[1]);
    }
    console.log(result);
  }

  getTenantList():void{

  }

}
