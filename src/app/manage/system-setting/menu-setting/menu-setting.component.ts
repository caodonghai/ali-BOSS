import {Component, OnInit} from '@angular/core';
import {ManageService} from '../../service/manage.service';

@Component({
  selector: 'app-menu-setting',
  templateUrl: './menu-setting.component.html',
  styleUrls: ['./menu-setting.component.css']
})
export class MenuSettingComponent implements OnInit {
  menuList: any[] = [];
  loading = false;

  constructor(private manageService: ManageService) {
  }

  ngOnInit() {
    this.getMenuList();
  }

  getMenuList() {
    this.loading = true;
    this.manageService.getMenuList().subscribe(res => {
      this.loading = false;
      if (res.resCode === 1) {
        this.menuList = this.handleData(res.data);
        $.fn.zTree.init($('#menuTree'), {}, this.menuList);
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
}
