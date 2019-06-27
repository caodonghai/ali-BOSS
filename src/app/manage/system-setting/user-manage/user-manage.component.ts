import {Component, ElementRef, OnInit} from '@angular/core';
import {SystemSettingService} from '../../service/systemSetting.service';
import { FormBuilder} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ExportService} from '../../service/export.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {
  // 表格查询相关
  name = '';
  private regionId: number;
  regionName: string;
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

  // 新增或者编辑用户相关
  isEdit = false;


  // 导出角色
  isExportUserLoading = false;

  seletedUser: any = {};

  constructor(private systemSettingService: SystemSettingService,
              private fb: FormBuilder,
              private msg: NzMessageService,
              private exportService: ExportService,
              private el: ElementRef,
              private router: Router,
              private modal: NzModalService) {
  }

  ngOnInit() {
    this.getUserList();
    this.getRoleList();
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

  addUser() {
    this.isEdit = false;
    this.router.navigate(['/manage/system-setting/user-manage/user-form', {status: 'add'}]);
  }


  handleTableClick(e) {
    const method = e.target.dataset.method;
    const id = e.target.dataset.id;
    if (id && method) {
      this.seletedUser = this.userList.find(item => item.id === id);
      if (method === 'detail') {

      } else if (method === 'modify') {

      } else if (method === 'reset') {

      } else if (method === 'delete') {
        this.deleteUser();
      }
    }
  }

  deleteUser() {
    this.modal.confirm({
      nzTitle: '删除',
      nzContent: '确定要删除该用户吗？',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.systemSettingService.deleteUser(this.seletedUser.id).subscribe(res => {
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

  exportUser() {
    this.isExportUserLoading = true;
    this.exportService.exportData(this.el.nativeElement.querySelector('#userTable'), '用户列表', '用户列表').finally(() => {
      this.isExportUserLoading = false;
    });
  }
}
