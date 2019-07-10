import {Component, OnInit} from '@angular/core';
import {SystemSettingService} from '../../service/systemSetting.service';
import {ZTreeSetting} from '../../../interface';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalService, UploadFile, UploadFilter, UploadXHRArgs} from 'ng-zorro-antd';
import {HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {AppService} from '../../../service/app.service';
import {formControlMarkAsDirty} from '../../../../util/formControlMarkAsDirty';

@Component({
  selector: 'app-app-menu-setting',
  templateUrl: './app-menu-setting.component.html',
  styleUrls: ['./app-menu-setting.component.css']
})
export class AppMenuSettingComponent implements OnInit {
  private appMenuTreeSetting: ZTreeSetting = {
    callback: {
      onClick: this.zTreeOnClick.bind(this),
      onExpand: this.expandNode.bind(this),
    }
  };

  // 表格
  appFunctionList: any[] = [];
  loading = false;
  pageSize = 10;
  pageNumber = 1;
  total = 0;
  parentNode: any = {};

  selectedFunction: any = {}; // 当前选中的app功能

  // 新增或app功能
  isEdit = false;
  appFunctionForm: FormGroup;
  isAppFunctionFormVisible = false;
  isSaveLoading = false;

  // 修改图标
  fileList: any = [];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  previewImage: string | undefined = '';
  previewVisible = false;
  filters: UploadFilter[] = [
    {
      name: 'type',
      fn: (fileList: UploadFile[]) => {
        const filterFiles = fileList.filter(w => ~['image/png', 'image/jpeg'].indexOf(w.type));
        if (filterFiles.length !== fileList.length) {
          this.msg.warning(`文件格式不正确`);
          return filterFiles;
        }
        return fileList;
      }
    }
  ];

  constructor(private systemSettingService: SystemSettingService,
              private msg: NzMessageService,
              private fb: FormBuilder,
              private appService: AppService,
              private modal: NzModalService) {
  }

  ngOnInit() {
    this.initAppMenuTree();
    this.getAppMenuListWithTreeParentCode();
    this.initAppFunctionForm();
  }

  initAppFunctionForm() {
    this.appFunctionForm = this.fb.group({
      name: ['', [Validators.required]],
      parents: [''],
      functionType: ['M'],
      imageUrl: [''],
      funcUrl: [''],
      iosFuncUrl: [''],
      remark: ['']
    });
  }

  getAppMenuListWithTreeParentCode() {
    const params = {
      pid: this.parentNode.id ? this.parentNode.id : 0,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      status: -1
    };
    this.loading = true;
    this.systemSettingService.getAppMenuListWithTreeParentCode(params).subscribe(res => {
      this.loading = false;
      if (res.resCode === 1) {
        this.appFunctionList = res.data.list;
        this.total = res.data.total;
      }
    });
  }

  initAppMenuTree() {
    const params = {
      pid: '',
      status: -1
    };
    this.systemSettingService.getAppMenuTreeList(params).subscribe(res => {
      if (res.resCode === 1) {
        $.fn.zTree.init($('#appMenuTree'), this.appMenuTreeSetting, res.data);
        this.parentNode = res.data[0];
      }
    });
  }

  expandNode(event, treeId, treeNode) {
    if (!treeNode.children || treeNode.children.length === 0) {
      const params = {
        pid: treeNode.id,
        status: -1
      };
      this.systemSettingService.getAppMenuTreeList(params).subscribe(res => {
        if (res.resCode === 1) {
          $.fn.zTree.getZTreeObj(treeId).addNodes(treeNode, res.data, true);
        }
      });
    }
  }

  zTreeOnClick(event, treeId, treeNode) {
    this.parentNode = treeNode;
    this.getAppMenuListWithTreeParentCode();
  }

  handleTableClick(e) {
    const id = e.target.dataset.id;
    const method = e.target.dataset.method;
    if (id && method) {
      this.selectedFunction = this.appFunctionList.find(item => item.id === id);
      if (method === 'enable') {
        this.enable();
      } else if (method === 'disable') {
        this.disable();
      } else if (method === 'edit') {
        this.edit();
      } else if (method === 'delete') {
        this.deleteAppFunction();
      }
    }
  }

  enable() {
    const params = {
      id: this.selectedFunction.id,
      status: 1
    };
    this.systemSettingService.editAppFunction(params).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('启用成功');
        this.getAppMenuListWithTreeParentCode();
      }
    });
  }

  disable() {
    const params = {
      id: this.selectedFunction.id,
      status: 2
    };
    this.systemSettingService.editAppFunction(params).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('禁用成功');
        this.getAppMenuListWithTreeParentCode();
      }
    });
  }

  edit() {
    this.isEdit = true;
    this.isAppFunctionFormVisible = true;
    this.appFunctionForm.patchValue({
      name: this.selectedFunction.name,
      parents: this.selectedFunction.parents,
      functionType: this.selectedFunction.functionType,
      imageUrl: this.selectedFunction.imageUrl,
      funcUrl: this.selectedFunction.funcUrl,
      iosFuncUrl: this.selectedFunction.iosFuncUrl,
      remark: this.selectedFunction.remark
    });
  }

  deleteAppFunction() {
    this.modal.confirm({
      nzTitle: '删除',
      nzContent: '确定要删除功能？删除该功能会将其子功能一起删除！',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.systemSettingService.deleteAppFuction(this.selectedFunction.id).subscribe(res => {
          if (res.resCode === 1) {
            this.msg.success('删除成功');
            this.getAppMenuListWithTreeParentCode();
            this.removeTreeNode(this.selectedFunction.id);
          }
        }, () => {
        }, () => {
          resolve();
        });
      })
    });
  }

  removeTreeNode(id: string) {
    const treeObj = $.fn.zTree.getZTreeObj('appMenuTree');
    const node = treeObj.getNodeByParam('id', id, null);
    if (node) {
      treeObj.removeNode(node);
    }
  }

  showAddAppFunctionModal() {
    if (this.parentNode.functionType !== 'M') {
      this.msg.warning('不能在非菜单节点下添加子菜单！');
    } else {
      this.isEdit = false;
      this.isAppFunctionFormVisible = true;
      this.appFunctionForm.patchValue({
        parents: this.parentNode.parentspath,
      });
    }
  }

  submitForm() {
    formControlMarkAsDirty(this.appFunctionForm);
    if (this.appFunctionForm.valid) {
      if (this.fileList[0] && this.fileList[0].response && this.fileList[0].response.data.resCode === 1) {
        this.appFunctionForm.patchValue({
          imageUrl: this.fileList[0].response.data.url
        });
      }
      this.isSaveLoading = true;
      if (this.isEdit) {
        this.editAppFunction();
      } else {
        this.addAppFunction();
      }
    }
  }

  addAppFunction() {
    this.systemSettingService.addAppFunction(this.appFunctionForm.value).subscribe(res => {
      this.isSaveLoading = false;
      if (res.resCode === 1) {
        this.msg.success('新增成功');
        this.getAppMenuListWithTreeParentCode();
        setTimeout(() => {
          this.isAppFunctionFormVisible = false;
          this.appFunctionForm.reset();
        }, 1500);
      }
    });
  }

  editAppFunction() {
    const params = Object.assign({}, this.appFunctionForm.value, {id: this.selectedFunction.id});
    this.systemSettingService.editAppFunction(params).subscribe(res => {
      this.isSaveLoading = false;
      if (res.resCode === 1) {
        this.msg.success('修改成功');
        this.getAppMenuListWithTreeParentCode();
        setTimeout(() => {
          this.isAppFunctionFormVisible = false;
        }, 1500);
      }
    });
  }

  customUploadReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    formData.append('file', item.file as any);
    return this.appService.upLoadFileUip(formData).subscribe((event: HttpEvent<{}>) => {
      if (event.type === HttpEventType.UploadProgress) {
        if (event.total > 0) {
          (event as any).percent = event.loaded / event.total * 100;
        }
        item.onProgress(event, item.file);
      } else if (event instanceof HttpResponse) {
        item.onSuccess(event.body, item.file, event);
        item.file.response = event.body;
      } else if (event instanceof HttpErrorResponse) {
        item.onError('上传出错', item.file);
      }
    });
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
}
