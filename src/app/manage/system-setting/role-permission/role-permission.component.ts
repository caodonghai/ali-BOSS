import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {SystemSettingService} from '../../service/systemSetting.service';
import {fromEvent, of, Subscription} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.css'],
})
export class RolePermissionComponent implements OnInit, OnDestroy, AfterViewInit {
  roleList: any = [];
  filterRoleList: any;
  selectedRole: any = {};
  isButtonLoading = false;

  checkableTreeSetting = {
    check: {
      enable: true,
      chkStyle: 'checkbox',
      chkboxType: {'Y': 's', 'N': 's'}
    },
    enable: true
  };

  subscription: Subscription;

  constructor(private systemSettingService: SystemSettingService,
              private el: ElementRef,
              private msg: NzMessageService) {
  }

  ngOnInit() {
    this.getRoleList();
  }

  ngAfterViewInit() {
    this.handleInputChange();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getRoleList() {
    this.systemSettingService.getRoleList().subscribe(res => {
      if (res.resCode === 1) {
        this.roleList = res.data.records;
        this.filterRoleList = this.roleList;
      }
    });
  }

  handleInputChange() {
    const target = this.el.nativeElement.querySelector('#searchInput1');
    this.subscription = fromEvent(target, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        delay(400)
      )
      .subscribe(res => {
        const filter = res ? res.trim() : '';
        if (filter === '') {
          this.filterRoleList = this.roleList;
        } else {
          this.filterRoleList = this.roleList.filter(item => item.name.includes(`${filter}`));
        }
      });
  }

  handleRoleListClick(e) {
    const id = e.target.dataset.id;
    if (id) {
      this.selectedRole = this.filterRoleList.find(item => item.id === id);
      this.getPermissionByRoleId(id);
    }
  }

  getPermissionByRoleId(id) {
    this.systemSettingService.getPermissionByRoleId(id).subscribe(res => {
      if (res.resCode === 1) {
        this.initCheckAbleTree(res.data);
        $.fn.zTree.init($('#resultTree'), {}, res.data);
      }
    });
  }

  initCheckAbleTree(checkedList) {
    const checkedAbleTreeData = JSON.parse(JSON.stringify(this.roleList)).map(role => {
      if (checkedList.find(item => item.id === role.id)) {
        role.checked = true;
      }
      return role;
    });
    $.fn.zTree.init($('#checkTree'), this.checkableTreeSetting, checkedAbleTreeData);
  }

  authorize() {
    this.isButtonLoading = true;
    const checkedRoleList = $.fn.zTree.getZTreeObj('checkTree').getCheckedNodes().map(item => item.id);
    const params = {
      powers: checkedRoleList,
      roleId: this.selectedRole.id,
    };
    this.systemSettingService.authorizeRole(params).subscribe(res => {
        if (res.resCode === 1) {
          this.msg.success('授权成功');
          this.getPermissionByRoleId(this.selectedRole.id);
        }
      }, () => {
      },
      () => {
        this.isButtonLoading = false;
      });
  }
}
