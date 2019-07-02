import {Component, OnInit} from '@angular/core';
import {SystemSettingService} from '../../service/systemSetting.service';
import {ZTreeSetting} from '../../../interface';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {formControlMarkAsDirty} from '../../../../util/formControlMarkAsDirty';
import {Response} from '../../../interface';

@Component({
  selector: 'app-data-dictionary',
  templateUrl: './data-dictionary.component.html',
  styleUrls: ['./data-dictionary.component.css']
})
export class DataDictionaryComponent implements OnInit {
  private treeSetting: ZTreeSetting = {
    async: {
      enable: true,
      autoParam: ['id', 'top'],
      dataType: 'json',
      url: '',
      type: 'get',
    },
    callback: {
      onAsyncSuccess: this.onAsyncSuccess.bind(this),
      onClick: this.zTreeOnClick.bind(this)
    }
  };
  private treeObj;

  name: string;

  // 表格
  dataDictionaryList: any[] = [];
  pageSize = 10;
  pageNumber = 1;
  total = 0;
  loading = false;
  globalSearchFlag = false;

  // 当前选中的节点
  currentNode: any = {};

  // 数据字典表单
  dataDictionaryForm: FormGroup;
  isEdit = false;
  isDataDictionaryFormVisible = false;
  isSaveLoading = false;

  // 当前选中的表格数据
  selected: any = {};

  // 是否展示详情模态窗
  isDetailModalVisible = false;

  constructor(private systemSettingService: SystemSettingService,
              private fb: FormBuilder,
              private msg: NzMessageService,
              private modal: NzModalService) {
  }

  ngOnInit() {
    this.initDataDictionaryTree();
    this.getDataDictionaryList();
    this.treeSetting.async.url = this.systemSettingService.getTempUrl() + '/information/v1/dictionary/findChildNodes';
    this.initForm();
  }

  initDataDictionaryTree() {
    this.systemSettingService.getDataDictionaryTree().subscribe(res => {
      if (res.resCode === 1) {
        $.fn.zTree.init($('#dataDictionaryTree'), this.treeSetting, res.data);
        this.treeObj = $.fn.zTree.getZTreeObj('dataDictionaryTree');
        this.currentNode = res.data;
      }
    });
  }

  initForm() {
    this.dataDictionaryForm = this.fb.group({
      pid: [''],
      name: ['', [Validators.required]],
      remark: [''],
      value: ['', [Validators.required]],
      top: ['']
    });
  }

  getDataDictionaryList() {
    let pid = '';
    let typeId = '';
    if (this.currentNode.top === '1') {
      typeId = this.currentNode.id;
      pid = '0';
    } else if (this.currentNode.top === '') {
      pid = '';
      typeId = '';
    } else {
      pid = this.currentNode.id;
      typeId = '';
    }
    const params = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      name: this.name ? this.name : '',
      pid,
      typeId
    };
    if (this.globalSearchFlag) {
      this.globalSearch();
    } else {
      this.loading = true;
      if (this.currentNode.id && this.currentNode.level !== 0) {
        // 左侧树有选中节点的情况
        this.systemSettingService.getDataDictionaryList(params).subscribe(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.dataDictionaryList = res.data.list;
            this.total = res.data.total;
          }
        });
      } else {
        // 没有选中节点时请求另外一个借口
        this.systemSettingService.getDataDictionaryListWithType(params).subscribe(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.dataDictionaryList = res.data.list;
            this.total = res.data.total;
          }
        });
      }
    }
  }

  globalSearch() {
    const params = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      name: this.name ? this.name : ''
    };
    this.systemSettingService.dataDictionaryGlobalSearch(params).subscribe(res => {
      this.loading = false;
      if (res.resCode === 1) {
        this.dataDictionaryList = res.data.list;
        this.total = res.data.total;
      }
    });
  }

  onAsyncSuccess(event, treeId, treeNode, res) {
    if (res.resCode === 1) {
      this.treeObj.removeNode(treeNode.children[0]);
      this.treeObj.addNodes(treeNode, res.data);
    }
  }

  zTreeOnClick(event, treeId, treeNode) {
    this.currentNode = treeNode;
    this.pageNumber = 1;
    this.getDataDictionaryList();
  }

  showAddDataDictionaryModal() {
    this.isEdit = false;
    this.systemSettingService.getDataDictionaryUUID().subscribe(res => {
      if (res.resCode === 1) {
        this.dataDictionaryForm.patchValue({
          value: res.data,
          pid: this.currentNode.id,
          top: this.currentNode.top
        });
      }
    });
    this.isDataDictionaryFormVisible = true;
  }

  submitForm() {
    formControlMarkAsDirty(this.dataDictionaryForm);
    if (this.dataDictionaryForm.valid) {
      this.isSaveLoading = true;
      if (this.isEdit) {
        this.editDataDictionary();
      } else {
        if (this.currentNode.top === null || this.currentNode.top === '') {
          this.addDataDictionaryType();
        } else {
          this.addDataDictionary();
        }
      }
    }
  }

  addDataDictionary() {
    this.systemSettingService.addDataDictionary(this.dataDictionaryForm.value).subscribe(res => {
      this.isSaveLoading = false;
      if (res.resCode === 1) {
        this.msg.success('新增成功');
        setTimeout(() => {
          this.isDataDictionaryFormVisible = false;
          this.dataDictionaryForm.reset();
          this.getDataDictionaryList();
          this.addNodeAfterAddDataDictionarySuccess(res);
        }, 1500);
      }
    });
  }

  addDataDictionaryType() {
    this.systemSettingService.addDataDictionaryType(this.dataDictionaryForm.value).subscribe(res => {
      this.isSaveLoading = false;
      if (res.resCode === 1) {
        this.msg.success('新增成功');
        setTimeout(() => {
          this.isDataDictionaryFormVisible = false;
          this.dataDictionaryForm.reset();
          this.getDataDictionaryList();
          this.addNodeAfterAddDataDictionarySuccess(res);
        }, 1500);
      }
    });
  }

  addNodeAfterAddDataDictionarySuccess(res: Response) {
    const node = this.treeObj.getNodeByParam('id', this.currentNode.id);
    node.isParent = true;
    this.treeObj.updateNode(node);
    if (this.currentNode.top === null || this.currentNode.top === '') {
      this.systemSettingService.getDataDictionaryTypeNodeById(res.data).subscribe(response => {
        if (response.resCode === 1) {
          this.treeObj.addNodes(node, response.data);
          this.treeObj.updateNode(node);
        }
      });
    } else {
      this.systemSettingService.getDataDictionaryNodeById(res.data).subscribe(response => {
        if (response.resCode === 1) {
          this.treeObj.addNodes(node, response.data);
          this.treeObj.updateNode(node);
        }
      });
    }
  }

  editDataDictionary() {
    const params = {
      id: this.selected.id,
      name: this.dataDictionaryForm.value.name,
      remark: this.dataDictionaryForm.value.remark,
      value: this.dataDictionaryForm.value.value
    };
    if (this.selected.pId === null || this.selected.pId === '') {
      this.systemSettingService.editDataDictionaryType(params).subscribe(res => {
        this.isSaveLoading = false;
        if (res.resCode === 1) {
          this.msg.success('修改成功');
          this.getDataDictionaryList();
          this.updateTreeNodeAfterEditSuccess();
          setTimeout(() => {
            this.isDataDictionaryFormVisible = false;
          });
        }
      });
    } else {
      this.systemSettingService.editDataDictionary(params).subscribe(res => {
        this.isSaveLoading = false;
        if (res.resCode === 1) {
          this.msg.success('修改成功');
          this.getDataDictionaryList();
          this.updateTreeNodeAfterEditSuccess();
          setTimeout(() => {
            this.isDataDictionaryFormVisible = false;
          });
        }
      });
    }
  }

  updateTreeNodeAfterEditSuccess() {
    const node = this.treeObj.getNodeByParam('id', this.selected.id);
    node.name = this.dataDictionaryForm.value.name;
    this.treeObj.updateNode(node);
  }

  handleTableClick(e) {
    const id = e.target.dataset.id;
    const method = e.target.dataset.method;
    if (id && method) {
      this.selected = this.dataDictionaryList.find(item => item.id === id);
      if (method === 'detail') {
        this.isDetailModalVisible = true;
      } else if (method === 'modify') {
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

  showEditModal() {
    this.isEdit = true;
    this.isDataDictionaryFormVisible = true;
    this.dataDictionaryForm.patchValue({
      pid: this.selected.pId,
      name: this.selected.typeName,
      remark: this.selected.remark,
      value: this.selected.typeValue
    });
  }

  up() {
    const params = {
      id: this.selected.id,
      pid: this.selected.pId,
      top: this.selected.top
    };
    if (this.selected.pId === null || this.selected.pId === '') {
      this.systemSettingService.moveUpDataDictionaryType(params).subscribe(res => {
        if (res.resCode === 1) {
          this.msg.success('上移成功');
          this.getDataDictionaryList();
          this.moveTreeNodeAfterMoveDataDictionarySuccess(this.selected.id, res.data, 'up');
        }
      });
    } else {
      this.systemSettingService.moveUpDataDictionary(params).subscribe(res => {
        if (res.resCode === 1) {
          this.msg.success('上移成功');
          this.getDataDictionaryList();
          this.moveTreeNodeAfterMoveDataDictionarySuccess(this.selected.id, res.data, 'up');
        }
      });
    }
  }

  down() {
    const params = {
      id: this.selected.id,
      pid: this.selected.pId,
      top: this.selected.top
    };
    if (this.selected.pId === null || this.selected.pId === '') {
      this.systemSettingService.moveDownDataDictionaryType(params).subscribe(res => {
        if (res.resCode === 1) {
          this.msg.success('下移成功');
          this.getDataDictionaryList();
          this.moveTreeNodeAfterMoveDataDictionarySuccess(this.selected.id, res.data, 'down');
        }
      });
    } else {
      this.systemSettingService.moveDownDataDictionary(params).subscribe(res => {
        if (res.resCode === 1) {
          this.msg.success('下移成功');
          this.getDataDictionaryList();
          this.moveTreeNodeAfterMoveDataDictionarySuccess(this.selected.id, res.data, 'down');
        }
      });
    }
  }

  deleteItem() {
    this.modal.confirm({
      nzTitle: '删除',
      nzContent: '确定要删除节点？删除该节点会将其子节点一起删除！',
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          if (this.selected.pId == null || this.selected.pId === '') {
            this.systemSettingService.deleteDataDictionaryType(this.selected.id).subscribe(res => {
              if (res.resCode === 1) {
                this.msg.success('删除成功');
                this.getDataDictionaryList();
                this.removeTreeNodeAfterDeleteSuccess(this.selected.id);
              }
            }, () => {
            }, () => {
              resolve();
            });
          } else {
            this.systemSettingService.deleteDataDictionary(this.selected.id).subscribe(res => {
              if (res.resCode === 1) {
                this.msg.success('删除成功');
                this.getDataDictionaryList();
                this.removeTreeNodeAfterDeleteSuccess(this.selected.id);
              }
            }, () => {
            }, () => {
              resolve();
            });
          }
        });
      }
    });
  }

  moveTreeNodeAfterMoveDataDictionarySuccess(id1: string, id2: string, upOrDown: 'up' | 'down') {
    const node1 = this.treeObj.getNodeByParam('id', id1);
    const node2 = this.treeObj.getNodeByParam('id', id2);
    if (upOrDown === 'up') {
      this.treeObj.moveNode(node1, node2, 'next');
    } else if (upOrDown === 'down') {
      this.treeObj.moveNode(node1, node2, 'prev');
    }
  }

  removeTreeNodeAfterDeleteSuccess(id: string) {
    const node = this.treeObj.getNodeByParam('id', id);
    const pNode = this.treeObj.getNodeByParam('id', node.pId);
    this.treeObj.removeNode(node);
    // 判断父节点是否还有元素
    if (pNode && pNode.children && pNode.children.length === 0) {
      pNode.isParent = false;
      this.treeObj.updateNode(pNode);
    }
    this.treeObj.selectNode(pNode);
  }

}
