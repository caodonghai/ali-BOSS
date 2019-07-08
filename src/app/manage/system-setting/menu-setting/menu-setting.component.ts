import {Component, OnInit} from '@angular/core';
import {SystemSettingService} from '../../service/systemSetting.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {formControlMarkAsDirty} from '../../../../util/formControlMarkAsDirty';

@Component({
  selector: 'app-menu-setting',
  templateUrl: './menu-setting.component.html',
  styleUrls: ['./menu-setting.component.css']
})
export class MenuSettingComponent implements OnInit {
  menuList: any[] = [];
  menuTreeList: any[] = [];
  loading = false;
  pageSize = 10;
  pageNumber = 1;
  total = 0;

  selected: any = {};

  // 编辑菜单表单
  isEditMenuFormModalVisible = false;
  editMenuForm: FormGroup;
  isSaveLoading = false;

  constructor(private systemSettingService: SystemSettingService,
              private msg: NzMessageService,
              private modal: NzModalService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.getMenuTreeList();
    this.getMenuList();
    this.editMenuForm = this.fb.group({
      name: ['', [Validators.required]],
      parents: [''],
      funcurl: [''],
      ico: [''],
      sortOrder: [''],
      requireJS: [''],
      description: ['']
    });
  }

  getMenuTreeList() {
    this.systemSettingService.getMenuTreeList().subscribe(res => {
      if (res.resCode === 1) {
        this.menuTreeList = this.handleData(res.data);
        $.fn.zTree.init($('#menuTree'), {}, this.menuTreeList);
      }
    });
  }

  getMenuList() {
    this.loading = true;
    const params = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      pid: 0,
      status: -1
    };
    this.systemSettingService.getMenuList(params).subscribe(res => {
      this.loading = false;
      if (res.resCode === 1) {
        this.menuList = res.data.records;
        this.total = res.data.totalNum;
      }
    });
  }

  handleData(list) {
    list.forEach(item => {
      item.title = item.name;
      item.key = item.id;
      if (item.children && item.children.length !== 0) {
        this.handleData(item.children);
      } else {
        item.isLeaf = true;
        delete item.children;
      }
    });
    return list;
  }

  handleTableClick(e) {
    const method = e.target.dataset.method;
    const id = e.target.dataset.id;
    if (id && method) {
      this.selected = this.menuList.find(item => item.id === id);
      if (method === 'enable') {
        this.enable();
      } else if (method === 'disable') {
        this.disable();
      } else if (method === 'edit') {
        this.showEditModal();
      } else if (method === 'up') {
        this.up();
      } else if (method === 'down') {
        this.down();
      } else if (method === 'delete') {
        this.deleteItem();
      }
    }

  }

  enable() {
    const params = {
      id: this.selected.id,
      status: 1
    };
    this.systemSettingService.modifyMenu(params).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('启用成功');
        this.getMenuList();
      }
    });
  }

  disable() {
    const params = {
      id: this.selected.id,
      status: 2
    };
    this.systemSettingService.modifyMenu(params).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('禁用成功');
        this.getMenuList();
      }
    });
  }

  showEditModal() {
    this.isEditMenuFormModalVisible = true;
    this.editMenuForm.patchValue({
      name: this.selected.name,
      parents: this.selected.parents,
      funcurl: this.selected.funcurl,
      ico: this.selected.ico,
      sortOrder: this.selected.sortOrder,
      requireJS: this.selected.requireJS,
      description: this.selected.description
    });
  }

  submitForm() {
    formControlMarkAsDirty(this.editMenuForm);
    if (this.editMenuForm.valid) {
      this.isSaveLoading = true;
      const params = Object.assign({}, this.editMenuForm.value, {id: this.selected.id});
      this.systemSettingService.modifyMenu(params).subscribe(res => {
        if (res.resCode === 1) {
          this.msg.success('修改成功');
          this.isSaveLoading = false;
          this.getMenuList();
          setTimeout(() => {
            this.isEditMenuFormModalVisible = false;
          }, 1500);
        }
      });
    }
  }

  up() {
    this.systemSettingService.moveUpMenu({id: this.selected.id}).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('上移菜单成功');
        this.getMenuList();
      }
    });
  }

  down() {
    this.systemSettingService.moveDownMenu({id: this.selected.id}).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('下移移菜单成功');
        this.getMenuList();
      }
    });
  }

  deleteItem() {
    this.modal.confirm({
      nzTitle: '删除',
      nzContent: `你确定要删除${this.selected.name}吗?`,
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          this.systemSettingService.deleteMenu({id: this.selected.id}).subscribe(res => {
              if (res.resCode === 1) {
                this.msg.success('删除成功');
              }
            }, () => {
            },
            () => {
              resolve();
            });
        });
      }
    });
  }
}
