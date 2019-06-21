import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {SystemSettingService} from '../../../service/systemSetting.service';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.css']
})
export class AddMenuComponent implements OnInit {
  private moduleTree: any[] = [];
  private leftTreeSetting = {
    check: {
      enable: true,
      autoCheckTrigger: true,
      chkboxType: {'Y': '', 'N': ''}
    },
    data: {
      simpleData: {
        enable: true
      }
    },
    view: {
      selectedMulti: false
    }
  };

  private rightTreeData: any[] = [];
  private rightTreeSetting = {
    data: {
      simpleData: {
        enable: true
      }
    },
    edit: {
      enable: true,
      editNameSelectAll: true,
      removeTitle: '删除',
      renameTitle: '重命名',
      showRemoveBtn: true,
      showRenameBtn: true
    },
    callback: {
      beforeRename: this.beforeRename.bind(this),
    },
    view: {
      selectedMulti: false
    }
  };

  private leftTree: any;
  private rightTree: any;

  isSaveLoading = false;

  constructor(private systemSettingService: SystemSettingService,
              private modal: NzModalService,
              private msg: NzMessageService) {
  }

  ngOnInit() {
    this.getModuleTree();
    this.getRightTree();
  }

  getModuleTree() {
    this.systemSettingService.getModuleTree().subscribe(res => {
      if (res.resCode === 1) {
        this.moduleTree = res.data;
        $.fn.zTree.init($('#leftTree'), this.leftTreeSetting, this.moduleTree);
        this.leftTree = $.fn.zTree.getZTreeObj('leftTree');
      }
    });
  }

  getRightTree() {
    this.systemSettingService.getMenuTree().subscribe(res => {
      if (res.resCode === 1) {
        this.rightTreeData = res.data;
        $.fn.zTree.init($('#rightTree'), this.rightTreeSetting, this.rightTreeData);
        this.rightTree = $.fn.zTree.getZTreeObj('rightTree');
      }
    });
  }

  save() {
    const data = {
      newMenus: this.rightTree.transformToArray(this.rightTree.getNodes())
    };
    this.isSaveLoading = true;
    this.systemSettingService.saveMenu(data).subscribe(res => {
      this.isSaveLoading = false;
      if (res.resCode === 1) {
        this.msg.success('保存成功');
        this.getRightTree();
      }
    });
  }

  beforeRename(treeId, treeNode, newName) {
    if (newName.length < 3) {
      this.msg.error('名称不能少于3个字符！');
      return false;
    } else {
      return true;
    }
  }

  removeLeftToRight() {
    const selectedNode = this.leftTree.getCheckedNodes(true);
    if (selectedNode && selectedNode.length !== 0) {
      const rightTreeSelectedNode = this.rightTree.getSelectedNodes();
      this.rightTree.addNodes(rightTreeSelectedNode ? rightTreeSelectedNode[0] : null, this.leftTree.transformToArray(selectedNode));
    } else {
      this.msg.warning('请选择要移动节点');
    }
  }

  addRootNode() {
    const node = {name: '新节点', opertateType: 1, t: 'New Node'};
    this.rightTree.addNodes(null, node);
  }

  addChildNode() {
    const selectedNode = this.rightTree.getSelectedNodes();
    if (selectedNode && selectedNode.length !== 0) {
      const node = {name: '新节点', opertateType: 1, t: 'New Node'};
      this.rightTree.addNodes(selectedNode[0], node);
    } else {
      this.msg.warning('请选择一个节点');
    }
  }

  leftTreeOpen() {
    $.fn.zTree.getZTreeObj('leftTree').expandAll(true);
  }

  leftTreeClose() {
    $.fn.zTree.getZTreeObj('leftTree').expandAll(false);
  }

  rightTreeOpen() {
    $.fn.zTree.getZTreeObj('rightTree').expandAll(true);
  }

  rightTreeClose() {
    $.fn.zTree.getZTreeObj('rightTree').expandAll(false);
  }

  goBack() {
    history.go(-1);
  }
}
