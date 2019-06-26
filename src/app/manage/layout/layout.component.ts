import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../../service/app.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isReverseArrow = false;
  width = 200;
  menus: any[]; // 菜单

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.menus = this.appService.getMenu();
  }

  ngOnDestroy() {

  }
}
