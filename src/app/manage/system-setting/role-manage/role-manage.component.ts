import {Component, OnInit} from '@angular/core';
import {SystemSettingService} from '../../service/systemSetting.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {formControlMarkAsDirty} from '../../../../util/formControlMarkAsDirty';
import {reject} from 'q';

@Component({
  selector: 'app-role-manage',
  templateUrl: './role-manage.component.html',
  styleUrls: ['./role-manage.component.css']
})
export class RoleManageComponent implements OnInit {
  roleList: any[] = [];
  loading = false;
  name = '';
  type = '';
  pageSize = 10;
  pageNumber = 1;
  total = 0;

  selectedRole: any = {};

  // 角色表单
  roleForm: FormGroup;
  isRoleFormModalVisible = false;
  isEdit = false;
  isSaveLoading = false;

  constructor(private systemSettingService: SystemSettingService,
              private msg: NzMessageService,
              private fb: FormBuilder,
              private modal: NzModalService) {
  }

  ngOnInit() {
    this.getRoleList();
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      typeId: ['1'],
      description: ['', [Validators.maxLength(100)]]
    });
  }

  getRoleList() {
    this.loading = true;
    const params = {
      name: this.name,
      typeId: this.type,
      status: -1,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };
    this.systemSettingService.getRoleListWithPaginationAndSearchCondition(params).subscribe(res => {
      this.loading = false;
      if (res.resCode === 1) {
        this.roleList = res.data.records;
        this.total = res.data.totalNum;
      }
    });
  }

  reset() {
    this.type = '';
    this.name = '';
  }

  submitForm() {
    formControlMarkAsDirty(this.roleForm);
    if (this.roleForm.valid) {
      this.isSaveLoading = true;
      if (this.isEdit) {
        this.modifyRole();
      } else {
        this.addRole();
      }
    }
  }

  addRole() {
    this.systemSettingService.addRole(this.roleForm.value).subscribe(res => {
      this.isSaveLoading = false;
      if (res.resCode === 1) {
        this.isRoleFormModalVisible = false;
        this.msg.success('新增角色成功');
        for (const key in this.roleForm.controls) {
          this.roleForm.controls[key].markAsPristine();
          this.roleForm.controls[key].updateValueAndValidity();
        }
        this.getRoleList();
      }
    });
  }

  modifyRole() {
    const params = Object.assign({}, this.roleForm.value, {id: this.selectedRole.id});
    this.systemSettingService.modifyRole(params).subscribe(res => {
      this.isSaveLoading = false;
      if (res.resCode === 1) {
        this.isRoleFormModalVisible = false;
        this.msg.success('修改角色成功');
        this.getRoleList();
      }
    });
  }

  handleTableClick(e) {
    const id = e.target.dataset.id;
    const method = e.target.dataset.method;
    if (id && method) {
      this.selectedRole = this.roleList.find(item => item.id === id);
      if (method === 'enable') {
        this.enable();
      } else if (method === 'disable') {
        this.disable();
      } else if (method === 'modify') {
        this.modify();
      } else if (method === 'delete') {
        this.deleteRole();
      }
    }
  }

  enable() {
    const params = {
      id: this.selectedRole.id,
      status: 1
    };
    this.systemSettingService.disableOrEnableRoleById(params).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('启用成功');
        this.getRoleList();
      }
    });
  }

  disable() {
    const params = {
      id: this.selectedRole.id,
      status: 2
    };
    this.systemSettingService.disableOrEnableRoleById(params).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('禁用成功');
        this.getRoleList();
      }
    });
  }

  modify() {
    this.isEdit = true;
    this.isRoleFormModalVisible = true;
    this.roleForm.patchValue({
      name: this.selectedRole.name,
      typeId: this.selectedRole.typeId,
      description: this.selectedRole.description
    });
  }

  deleteRole() {
    this.modal.confirm({
      nzTitle: '删除',
      nzContent: `你确认要删除${this.selectedRole.name}这一角色吗？`,
      nzOnOk: () => new Promise((resolve, reject) => {
        this.systemSettingService.deleteRole(this.selectedRole.id).subscribe(res => {
          if (res.resCode === 1) {
            this.msg.success('删除成功');
            this.getRoleList();
          }
        }, () => {
        }, () => {
          resolve();
        });
      })
    });
  }
}
