import {Component, OnInit} from '@angular/core';
import {ManageService} from '../../service/manage.service';

@Component({
  selector: 'app-menu-setting',
  templateUrl: './menu-setting.component.html',
  styleUrls: ['./menu-setting.component.css']
})
export class MenuSettingComponent implements OnInit {
  menuList: any[] = [];
  menuTreeList: any[] = [];
  loading = false;
  pageSize = 10;
  pageNumber = 1;
  total = 0;

  selected: any = {};

  constructor(private manageService: ManageService) {
  }

  ngOnInit() {
    this.getMenuTreeList();
    this.getMenuList();
  }

  getMenuTreeList() {
    this.manageService.getMenuTreeList().subscribe(res => {
      if (res.resCode === 1) {
        this.menuTreeList = this.handleData(res.data);
        $.fn.zTree.init($('#menuTree'), {}, this.menuTreeList);
      }
    });
  }

  getMenuList() {
    this.loading = true;
    const params = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      pid: 0,
      status: -1
    };
    this.manageService.getMenuList(params).subscribe(res => {
      this.loading = false;
      if (res.resCode === 1) {
        this.menuList = res.data.records;
        this.total = res.data.totalNum;
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

  handleTableClick(e) {
    const method = e.target.dataset.method;
    const id = e.target.dataset.id;
    if (id && method) {
      this.selected = this.menuList.filter(item => item.id === id);
      if (method === 'enable') {
        this.enable();
      } else if (method === 'disable') {
        this.disable();
      } else if (method === 'up') {
        this.up();
      } else if (method === 'down') {
        this.down();
      } else if (method === 'delete') {
        this.deleteItem();
      }
    }

  }

  enable() {

  }

  disable() {

  }

  up() {

  }

  down() {

  }

  deleteItem() {

  }
}
