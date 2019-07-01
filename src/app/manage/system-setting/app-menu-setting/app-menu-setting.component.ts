import {Component, OnInit} from '@angular/core';
import {SystemSettingService} from '../../service/systemSetting.service';
import {ZTreeSetting} from '../../../interface';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, UploadFile, UploadFilter} from 'ng-zorro-antd';

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
  parentCode: string;

  selectedFunction: any = {}; // 当前选中的app功能

  // 新增或app功能
  isEdit = false;
  appFunctionForm: FormGroup;
  isAppFunctionFormVisible = false;

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
              private fb: FormBuilder) {
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
      functionType: [''],
      imageUrl: [''],
      funcUrl: [''],
      iosFuncUrl: [''],
      remark: ['']
    });
  }

  getAppMenuListWithTreeParentCode() {
    const params = {
      pid: this.parentCode ? this.parentCode : 0,
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
    this.parentCode = treeNode.id;
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
    this.systemSettingService.enableOrDisableAppFunction(params).subscribe(res => {
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
    this.systemSettingService.enableOrDisableAppFunction(params).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('禁用成功');
        this.getAppMenuListWithTreeParentCode();
      }
    });
  }

  edit() {
    this.isEdit = true;
    this.isAppFunctionFormVisible = true;
  }

  deleteAppFunction() {

  }
}
