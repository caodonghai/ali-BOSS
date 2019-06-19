import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import {HomeComponent} from './home/home.component';
import {InformationNoticeComponent} from './information-notice/information-notice.component';
import {InformationFeedbackComponent} from './information-feedback/information-feedback.component';
import {TenantManageComponent} from './tenant-manage/tenant-manage.component';
import {PackageManageComponent} from './package-manage/package-manage.component';
import {SalesStatisticsComponent} from './sales-statistics/sales-statistics.component';
import {MenuSettingComponent} from './system-setting/menu-setting/menu-setting.component';
import {UserSettingComponent} from './system-setting/user-setting/user-setting.component';
import {PermissionSettingComponent} from './system-setting/permission-setting/permission-setting.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent},
      {path: 'tenant-manage', component: TenantManageComponent},
      {path: 'package-manage', component: PackageManageComponent},
      {path: 'sales-statistics', component: SalesStatisticsComponent},
      {path: 'information-notice', component: InformationNoticeComponent},
      {path: 'information-feedback', component: InformationFeedbackComponent},
      {path: 'system-setting/menu-setting', component: MenuSettingComponent},
      {path: 'system-setting/user-setting', component: UserSettingComponent},
      {path: 'system-setting/permission-setting', component: PermissionSettingComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule {
}
