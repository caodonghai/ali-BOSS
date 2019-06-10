import {Component, OnInit} from '@angular/core';
import {ManageService} from '../service/manage.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-package-manage',
  templateUrl: './package-manage.component.html',
  styleUrls: ['./package-manage.component.css']
})
export class PackageManageComponent implements OnInit {
  productManageList: any[] = [];
  productList: any[] = []; // 用于表单下拉框
  userList: any[] = []; // 某套餐用户列表
  name = '';
  type = '';
  status = '';
  loading = false;
  pageSize = 10;
  pageNumber = 1;
  total = 0;
  selected: any = {};
  isSaveLoading = false;
  isAddModalVisible = false;
  isDetailModalVisible = false;
  isUserModalVisible = false;

  // 弹出框表格
  loading1 = false;
  pageSize1 = 10;
  pageNumber1 = 1;
  total1 = 0;

  isEdit = false; // 表单是否处于编辑模式

  addProductForm: FormGroup;

  constructor(private manageService: ManageService, private modal: NzModalService, private fb: FormBuilder, private msg: NzMessageService) {

  }

  ngOnInit() {
    this.addProductForm = this.fb.group({
      name: ['', [Validators.required]],
      versionCode: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      status: ['', [Validators.required]],
      accountQuantity: ['', [Validators.required, Validators.pattern('^[1-9]\d*$')]],
      level: ['', [Validators.required]],
      sellCycle: ['', [Validators.required, Validators.pattern('^[1-9]\d*$')]],
      cycleType: ['1', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{1,3})?$')]],
      description: ['', [Validators.maxLength(400)]],
    });
    this.getProductManageList();
    this.getProductList();
  }

  getProductManageList() {
    const params = {
      name: this.name,
      type: this.type,
      status: this.status,
      pageSize: this.pageSize,
      pageNumber: this.pageNumber
    };
    this.manageService.getProductManageList(params).subscribe(res => {
      this.productManageList = res.data.list;
      this.total = res.data.total;
    });
  }

  getProductList() {
    this.manageService.getProductOptionList().subscribe(res => {
      this.productList = res.data.list;
    });
  }

  getUserList() {
    this.isUserModalVisible = true;
    const params = {
      id: this.selected.id,
      pageSize: this.pageSize1,
      pageNumber: this.pageNumber1
    };
    this.loading1 = true;
    this.manageService.getProductUserList(params).subscribe(res => {
      this.loading1 = false;
      this.userList = res.data.list;
      this.total1 = res.data.total;
    });
  }

  handleTableClick(e) {
    const method = e.target.dataset.method;
    const id = e.target.dataset.id;
    if (method && id) {
      this.selected = this.productManageList.find(item => item.id === id);
      if (method === 'detail') {
        this.isDetailModalVisible = true;
      } else if (method === 'modify') {
        this.modify();
      } else if (method === 'delete') {
        this.deleteItem();
      } else if (method === 'user-count') {
        this.getUserList();
      }
    }
  }


  modify(): void {
    this.isAddModalVisible = true;
    this.isEdit = true;
    this.addProductForm.patchValue({
      name: this.selected.name,
      versionCode: this.selected.versionCode,
      productId: this.selected.productCode,
      status: this.selected.status.toString(),
      accountQuantity: this.selected.accountQuantity,
      level: this.selected.level.toString(),
      sellCycle: this.selected.sellCycle,
      cycleType: this.selected.cycleType.toString(),
      price: this.selected.price,
      description: this.selected.description,
    });
  }

  deleteItem(): void {
    const params = {
      id: this.selected.id
    };
    this.modal.confirm({
      nzTitle: '删除',
      nzContent: '确定要删除该套餐吗',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.manageService.deleteProduct(params).subscribe(
          res => {
            this.msg.success('删除成功');
            this.getProductManageList();
          },
          error => {
          },
          () => {
            resolve();
          }
        );
      })
    });
  }

  submitForm() {
    for (const i in this.addProductForm.controls) {
      this.addProductForm.controls[i].markAsDirty();
      this.addProductForm.controls[i].updateValueAndValidity();
    }
    if (this.addProductForm.valid) {
      this.isSaveLoading = true;
      if (this.isEdit) {
        this.edit();
      } else {
        this.add();
      }
    }
  }

  add() {
    this.manageService.addProduct(this.addProductForm.value).subscribe(res => {
      this.isSaveLoading = false;
      if (res.resCode === 1) {
        this.msg.success('新增成功');
        this.isAddModalVisible = false;
        this.resetAddForm();
        this.getProductManageList();
      }
    });
  }

  edit() {
    const params = Object.assign({}, this.addProductForm.value, {id: this.selected.id});
    this.manageService.editProduct(params).subscribe(res => {
      this.isSaveLoading = false;
      if (res.resCode === 1) {
        this.msg.success('编辑成功');
        this.isAddModalVisible = false;
        this.resetAddForm();
        this.getProductManageList();
      }
    });
  }

  resetAddForm() {
    this.addProductForm.reset();
    for (const key in this.addProductForm.controls) {
      this.addProductForm.controls[key].markAsPristine();
      this.addProductForm.controls[key].updateValueAndValidity();
    }
    this.addProductForm.patchValue({
      cycleType: '1'
    });
  }
}
