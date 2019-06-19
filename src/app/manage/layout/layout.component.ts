import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../../service/app.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

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
  currentRoute: ''; // 当前路由

  constructor(private appService: AppService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.menus = this.appService.getMenu();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.currentRoute = (event as any).url;
    });
    this.currentRoute = (this.activatedRoute.snapshot as any)._routerState.url;
  }

  ngOnDestroy() {

  }
}
