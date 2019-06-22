import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {SystemSettingService} from '../../service/systemSetting.service';
import {fromEvent, Subscription} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd';
import {delay, map} from 'rxjs/operators';

@Component({
  selector: 'app-menu-permission',
  templateUrl: './menu-permission.component.html',
  styleUrls: ['./menu-permission.component.css']
})
export class MenuPermissionComponent implements OnInit, AfterViewInit, OnDestroy {
  menuTree: any[] = [];
  filterMenuTree: any;
  selectedMenu: any = {};
  isButtonLoading = false;

  functionType = 1;

  checkableTreeSetting = {
    check: {
      enable: true,
      chkStyle: 'checkbox',
      chkboxType: {'Y': 's', 'N': 's'}
    },
    enable: true
  };

  subscription: Subscription;

  constructor(private systemSettingService: SystemSettingService,
              private el: ElementRef,
              private msg: NzMessageService) {
  }

  ngOnInit() {
    this.getAuthorizeMenuTree();
  }

  ngAfterViewInit() {
    this.handleInputChange();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleInputChange() {
    const target = this.el.nativeElement.querySelector('#searchInput2');
    this.subscription = fromEvent(target, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        delay(400)
      )
      .subscribe(res => {
        const filter = res ? res.trim() : '';
        if (filter === '') {
          this.filterMenuTree = this.menuTree;
        } else {
          this.filterMenuTree = this.menuTree.filter(item => item.name.includes(`${filter}`));
        }
      });
  }

  getAuthorizeMenuTree() {
    this.systemSettingService.getAuthorizeMenuTree().subscribe(res => {
      if (res.resCode === 1) {
        this.menuTree = res.data.records;
        this.filterMenuTree = res.data.records;
      }
    });
  }

  handleMenuListClick(e) {
    const id = e.target.dataset.id;
    if (id) {
      this.selectedMenu = this.filterMenuTree.find(item => item.id === id);
      this.getMenuTreeByRoleId(id);
      this.getCheckedMenuTreeByRoleId(id);
    }
  }

  getMenuTreeByRoleId(id) {
    this.systemSettingService.getMenuTreeByRoleId({roleId: id, functionType: this.functionType}).subscribe(res => {
      if (res.resCode === 1) {
        $.fn.zTree.init($('#checkTree'), this.checkableTreeSetting, res.data);
      }
    });
  }

  getCheckedMenuTreeByRoleId(id) {
    this.systemSettingService.getCheckedMenuTreeByRoleId({roleId: id, functionType: this.functionType}).subscribe(res => {
      if (res.resCode === 1) {
        $.fn.zTree.init($('#resultTree'), {}, res.data);
      }
    });
  }

  authorizeMenu() {
    this.isButtonLoading = true;
    const checkedRoleList = $.fn.zTree.getZTreeObj('checkTree').getCheckedNodes().map(item => item.id);
    const params = {
      powers: checkedRoleList,
      roleId: this.selectedMenu.id,
      functionType: this.functionType
    };
    this.systemSettingService.authorizeMenu(params).subscribe(res => {
        if (res.resCode === 1) {
          this.msg.success('授权成功');
          this.getCheckedMenuTreeByRoleId(this.selectedMenu.id);
          this.getMenuTreeByRoleId(this.selectedMenu.id);
        }
      }, () => {
      },
      () => {
        this.isButtonLoading = false;
      });
  }
}
