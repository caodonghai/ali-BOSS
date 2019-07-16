// http请求响应体格式
export interface Response {
  data: any;
  resCode: number;
  resMsg: string;
}

/**
 * zTree类型声明
 * 参考 http://www.treejs.cn/v3/api.php
 * 暂时只写了一部分声明，未添加注释
 */
export interface ZTreeSetting {
  async?: ZTreeAsync;
  callback?: ZTreeCallback;
  data?: ZTreeData;
  check?: ZTreeCheck;
  edit?: any;
  view?: any;
}

interface ZTreeAsync {
  enable: boolean;
  autoParam?: string[];
  contentType?: string;
  dataType?: string;
  dataFilter?: any;
  otherParam?: string[];
  type?: 'post' | 'get';
  header?: any;
  xhrFields?: any;
  url: string;
}

/**
 * zTree节点
 */
interface ZTreeNode {
  checked?: boolean;
  children?: ZTreeNode[];
  chkDisabled?: boolean;
  click?: string;
  isParent?: boolean;
  isHidden?: boolean;
  name?: string;
  nocheck?: boolean;
  open?: boolean;
  target?: string;
  url?: string;

  [key: string]: any;
}

/**
 * 回调函数
 */
interface ZTreeCallback {
  beforeAsync?: (treeId: string, treeNode: ZTreeNode) => boolean;
  beforeCheck?: (treeId: string, treeNode: ZTreeNode) => boolean;
  beforeClick?: (treeId: string, treeNode: ZTreeNode, flag: boolean) => boolean;
  beforeCollapse?: (treeId: string, treeNode: ZTreeNode) => boolean;
  beforeDblClick?: (treeId: string, treeNode: ZTreeNode) => boolean;
  beforeDrag?: (treeId: string, treeNode: ZTreeNode) => boolean;
  beforeDragOpen?: (treeId: string, treeNode: ZTreeNode) => boolean;
  beforeDrop?: (treeId: string, treeNode: ZTreeNode, targetNode: ZTreeNode, moveType: 'inner' | 'prev' | 'next', isCopy: boolean) => boolean;
  onClick?: (event: MouseEvent, treeId: string, treeNode: ZTreeNode, clickFlag: 0 | 1 | 2) => boolean;
  beforeRename?: any;

  [key: string]: any;
}

interface ZTreeData {
  keep?: {
    leaf?: boolean;
    parent?: boolean;
  };
  key?: {
    checked?: boolean;
    isParent?: string;
    isHidden?: string;
    name?: string;
    title?: string;
    url?: string;
  };
  simpleData?: {
    enable: boolean;
    idKey?: string;
    pIdKey?: string;
    rootPId?: string | number | null;
  };
}

interface ZTreeCheck {
  enable: boolean;
  autoCheckTrigger?: boolean;
  chkboxType?: any;
  chkStyle?: string;
  nocheckInherit?: boolean;
  chkDisabledInherit?: boolean;
  radioType?: string;
}
