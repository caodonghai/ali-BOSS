import {Component, ElementRef, OnInit} from '@angular/core';
import {SystemSettingService} from '../../service/systemSetting.service';
import {FormBuilder} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ExportService} from '../../service/export.service';
import {Router} from '@angular/router';
import {AppService} from '../../../service/app.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {
  // 表格查询相关
  name = '';
  private regionId: number;
  regionName = '';
  showChooseRegionModal = false;
  roleId: string;
  roleList: any[] = [];
  pageSize = 10;
  pageNumber = 1;
  total = 0;
  loading = false;

  // 表格选中相关
  userList: any = [];
  checkedUserList: any = [];
  mapOfCheckedId: { [key: string]: boolean } = {};

  // 赋予角色相关
  selectedRole: string;
  isGiveRoleOkLoading = false;
  isGiveRoleModalVisible = false;

  // 导出角色
  isExportUserLoading = false;

  // 选中的用户
  selectedUser: any = {};

  // 详情相关
  fileUrl = '';
  isDetailModalVisible = false;
  userStatusEnum: any = {};

  constructor(private systemSettingService: SystemSettingService,
              private fb: FormBuilder,
              private msg: NzMessageService,
              private exportService: ExportService,
              private el: ElementRef,
              private router: Router,
              private modal: NzModalService,
              private appService: AppService) {
  }

  ngOnInit() {
    this.getUserList();
    this.getRoleList();
    this.getUserStatusList();
    this.fileUrl = this.appService.getFileUrl();
  }

  getUserList() {
    this.loading = true;
    const params = {
      regionId: this.regionId ? this.regionId : '',
      name: this.name,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      roleId: this.roleId ? this.roleId : ''
    };
    this.systemSettingService.getUserList(params).subscribe(res => {
      this.loading = false;
      if (res.resCode === 1) {
        this.userList = res.data.records;
        this.total = res.data.totalNum;
        this.checkedUserList = [];
        this.mapOfCheckedId = {};
      }
    });
  }

  getRoleList() {
    this.systemSettingService.getRoleList().subscribe(res => {
      if (res.resCode === 1) {
        this.roleList = res.data.records;
      }
    });
  }

  getUserStatusList() {
    this.systemSettingService.getUserStatusList().subscribe(res => {
      if (res.resCode === 1) {
        this.userStatusEnum = res.data;
      }
    });
  }

  getResult(e) {
    this.regionName = e.name;
    this.regionId = e.id;
  }

  addUser() {
    this.router.navigate(['/manage/system-setting/user-manage/user-form']);
  }


  handleTableClick(e) {
    const method = e.target.dataset.method;
    const id = e.target.dataset.id;
    if (id && method) {
      this.selectedUser = this.userList.find(item => item.id === id);
      if (method === 'detail') {
        this.selectedUser.roleNameList = this.selectedUser.roleList.map(item => item.typeName).join(',');
        this.selectedUser.statusText = this.userStatusEnum.find(item => item.status === this.selectedUser.status).description;
        this.isDetailModalVisible = true;
      } else if (method === 'modify') {
        this.router.navigate(['/manage/system-setting/user-manage/user-modify', {id: this.selectedUser.id}]);
      } else if (method === 'reset') {
        this.resetPassword();
      } else if (method === 'delete') {
        this.deleteUser();
      }
    }
  }

  resetPassword() {
    this.modal.confirm({
      nzTitle: '重置密码',
      nzContent: '确定重置用户密码吗？',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.systemSettingService.resetUserPassword(this.selectedUser.id).subscribe(res => {
          if (res.resCode === 1) {
            this.msg.success('重置成功');
            this.getUserList();
          }
        }, () => {
        }, () => {
          resolve();
        });
      })
    });
  }

  deleteUser() {
    this.modal.confirm({
      nzTitle: '删除',
      nzContent: '确定要删除该用户吗？',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.systemSettingService.deleteUser(this.selectedUser.id).subscribe(res => {
          if (res.resCode === 1) {
            this.msg.success('删除成功');
            this.getUserList();
          }
        }, () => {
        }, () => {
          resolve();
        });
      })
    });
  }

  checkAll(e) {
    this.userList.forEach(item => {
      this.mapOfCheckedId[item.id] = e;
    });
    if (e) {
      this.checkedUserList = [...this.userList];
    } else {
      this.checkedUserList = [];
    }
  }

  checkOne(e, user) {
    if (e) {
      this.checkedUserList.push(user);
    } else {
      this.checkedUserList = this.checkedUserList.filter(item => item.id !== user.id);
    }
  }

  showGiveRoleModal() {
    if (this.checkedUserList.length === 0) {
      this.msg.warning('请选择用户');
    } else {
      this.isGiveRoleModalVisible = true;
    }
  }

  giveRole() {
    if (this.selectedRole) {
      this.isGiveRoleOkLoading = true;
      const params = {
        ids: this.checkedUserList.map(item => item.id).join(','),
        roleId: this.selectedRole
      };
      this.systemSettingService.giveRole(params).subscribe(res => {
        this.isGiveRoleOkLoading = false;
        if (res.resCode === 1) {
          this.isGiveRoleModalVisible = false;
          this.msg.success('操作成功');
          this.getUserList();
        }
      });
    } else {
      this.msg.warning('请选择角色');
    }
  }

  batchDeleteUser() {
    if (this.checkedUserList.length === 0) {
      this.msg.warning('请选择要删除的用户');
    } else {
      this.modal.confirm({
        nzTitle: '批量删除',
        nzContent: `确定要批量删除选中的${this.checkedUserList.length}个用户吗？`,
        nzOnOk: () => new Promise((resolve, reject) => {
          const idArray = this.checkedUserList.map(item => item.id).join(',');
          this.systemSettingService.batchDeleteUser(idArray).subscribe(res => {
            if (res.resCode === 1) {
              this.msg.success('删除成功');
              this.getUserList();
            }
          }, () => {
          }, () => {
            resolve();
          });
        })
      });
    }
  }

  exportUser() {
    this.isExportUserLoading = true;
    this.exportService.exportData(this.el.nativeElement.querySelector('#userTable'), '用户列表', '用户列表').finally(() => {
      this.isExportUserLoading = false;
    });
  }
}
