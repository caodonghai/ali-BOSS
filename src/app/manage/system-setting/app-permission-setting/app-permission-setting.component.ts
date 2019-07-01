import {Component, OnDestroy, OnInit} from '@angular/core';
import {ZTreeSetting} from '../../../interface';
import {SystemSettingService} from '../../service/systemSetting.service';
import {debounceTime, delay, first} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-app-permission-setting',
  templateUrl: './app-permission-setting.component.html',
  styleUrls: ['./app-permission-setting.component.css']
})
export class AppPermissionSettingComponent implements OnInit, OnDestroy {
  menuTree: any[] = [];
  filterMenuTree: any;
  selectedMenu: any = {};
  isButtonLoading = false;

  functionType = 5;

  checkableTreeSetting: ZTreeSetting = {
    check: {
      enable: true,
      chkStyle: 'checkbox',
      chkboxType: {'Y': 's', 'N': 's'}
    }
  };

  searchCondition = new FormControl('');
  subscription: Subscription;

  constructor(private systemSettingService: SystemSettingService,
              private msg: NzMessageService) {
  }

  ngOnInit() {
    this.getAuthorizeMenuTree();
    this.handleInputChange();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAuthorizeMenuTree() {
    this.systemSettingService.getAuthorizeMenuTree().subscribe(res => {
      if (res.resCode === 1) {
        this.menuTree = res.data.records;
        this.filterMenuTree = res.data.records;
      }
    });
  }

  handleMenuListClick(e) {
    const id = e.target.dataset.id;
    if (id) {
      this.selectedMenu = this.filterMenuTree.find(item => item.id === id);
      this.getMenuTreeByRoleId(id);
      this.getCheckedMenuTreeByRoleId(id);
    }
  }

  handleInputChange() {
    this.subscription = this.searchCondition.valueChanges
      .pipe(
        debounceTime(400)
      )
      .subscribe(res => {
        const filter = res ? res.trim() : '';
        if (filter === '') {
          this.filterMenuTree = this.menuTree;
        } else {
          this.filterMenuTree = this.menuTree.filter(item => item.name.includes(`${filter}`));
        }
      });
  }

  getMenuTreeByRoleId(id) {
    this.systemSettingService.getMenuTreeByRoleId({roleId: id, functionType: this.functionType}).subscribe(res => {
      if (res.resCode === 1) {
        $.fn.zTree.init($('#checkTree'), this.checkableTreeSetting, res.data);
      }
    });
  }

  getCheckedMenuTreeByRoleId(id) {
    this.systemSettingService.getCheckedMenuTreeByRoleId({roleId: id, functionType: this.functionType}).subscribe(res => {
      if (res.resCode === 1) {
        $.fn.zTree.init($('#resultTree'), {}, res.data);
      }
    });
  }

  authorizeMenu() {
    this.isButtonLoading = true;
    const checkedRoleList = $.fn.zTree.getZTreeObj('checkTree').getCheckedNodes().map(item => item.id);
    const params = {
      powers: checkedRoleList,
      roleId: this.selectedMenu.id,
      functionType: this.functionType
    };
    this.systemSettingService.authorizeMenu(params).subscribe(res => {
        if (res.resCode === 1) {
          this.msg.success('授权成功');
          this.getCheckedMenuTreeByRoleId(this.selectedMenu.id);
          this.getMenuTreeByRoleId(this.selectedMenu.id);
        }
      }, () => {
      },
      () => {
        this.isButtonLoading = false;
      });
  }
}
