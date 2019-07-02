// http请求响应体格式
export interface Response {
  data: any;
  resCode: number;
  resMsg: string;
}

// ztree配置
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
  type?: 'post'|'get';
  header?: any;
  xhrFields?: any;
  url: string;
}

interface ZTreeCallback {
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
