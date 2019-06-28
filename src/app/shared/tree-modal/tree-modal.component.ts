import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ZTreeSetting} from '../../interface';
import {SystemSettingService} from '../../manage/service/systemSetting.service';

@Component({
  selector: 'app-tree-modal',
  templateUrl: './tree-modal.component.html',
  styleUrls: ['./tree-modal.component.css']
})
export class TreeModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() showMask = true;
  @Input() type = 'region';

  @Output() result: EventEmitter<string> = new EventEmitter<string>();

  private tempUrl = 'http://10.0.9.201:8080/api';
  private regionCode: number = JSON.parse(sessionStorage.getItem('userDTO')).regionId;
  private setting: ZTreeSetting;
  private isTreeInit = false;

  treeModalSetting: any = {};

  inputResult = '';

  constructor(private systemService: SystemSettingService) {
  }

  ngOnInit() {
    this.treeModalSetting = this.getTreeModalSetting(this.type);
    this.setting = this.treeModalSetting.setting;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.show.currentValue === true && !this.isTreeInit) {
      this.systemService.getTree(this.treeModalSetting.treeUrl).subscribe(res => {
        if (res.resCode === 1) {
          $.fn.zTree.init($('#modalTree'), this.setting, res.data);
          this.isTreeInit = true;
        }
      });
    }
  }

  zTreeOnClick(event, treeId, treeNode) {
    this.result.emit(treeNode);
  }

  zTreeOnExpand(event, treeId, treeNode) {
    if (treeNode.children != null && treeNode.children.length > 0) {
      return;
    }
    this.systemService.getTree(`${this.treeModalSetting.childTreeUrl}?${this.treeModalSetting.parentParamKey}=${treeNode.id}`)
      .subscribe(res => {
        if (res.resCode === 1) {
          const treeObj = $.fn.zTree.getZTreeObj(treeId);
          treeObj.addNodes(treeNode, -1, res.data);
          if (treeNode.children[0].resCode === 1) {
            treeObj.removeNode(treeNode.children[0]);
            treeObj.updateNode(treeNode);
          }
        }
      });
  }

  searchTree(e?: KeyboardEvent) {
    if (!e || e.key === 'Enter') {
      this.systemService.getTree(`${this.treeModalSetting.searchUrl}?${this.treeModalSetting.searchParamKey}=${this.inputResult}`)
        .subscribe(res => {
          if (res.resCode === 1) {
            $.fn.zTree.init($('#modalTree'), this.setting, res.data);
          }
        });
    }
  }

  getTreeModalSetting(type: string): any {
    const settings = {
      region: {
        title: '选择区域',
        placeholder: '请输入区域名称',
        treeUrl: this.tempUrl + '/uip/tree/initTree',
        childTreeUrl: this.tempUrl + '/uip/tree/zTreeOnExpand',
        searchUrl: this.tempUrl + '/uip/tree/zTreeOnExpand',
        treeParam: {
          regionCode: this.regionCode
        },
        searchParamKey: 'areaName',
        parentParamKey: 'treeId',
        setting: {
          view: {},
          data: {
            simpleData: {
              enable: true
            },
            keep: {
              parent: true
            }
          },
          callback: {
            onClick: this.zTreeOnClick.bind(this),
            onExpand: this.zTreeOnExpand.bind(this)
          }
        }
      }
    };
    return settings[type];
  }
}

