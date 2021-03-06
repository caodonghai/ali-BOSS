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
import {AddMenuComponent} from './system-setting/menu-setting/add-menu/add-menu.component';
import {RolePermissionComponent} from './system-setting/role-permission/role-permission.component';
import {MenuPermissionComponent} from './system-setting/menu-permission/menu-permission.component';
import {UserManageComponent} from './system-setting/user-manage/user-manage.component';
import {UserFormComponent} from './system-setting/user-manage/user-form/user-form.component';
import {ModifyUserComponent} from './system-setting/user-manage/modify-user/modify-user.component';
import {RoleManageComponent} from './system-setting/role-manage/role-manage.component';
import {DataDictionaryComponent} from './system-setting/data-dictionary/data-dictionary.component';
import {AppMenuSettingComponent} from './system-setting/app-menu-setting/app-menu-setting.component';
import {AppPermissionSettingComponent} from './system-setting/app-permission-setting/app-permission-setting.component';

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
      {path: 'system-setting/menu-setting/add', component: AddMenuComponent},
      {path: 'system-setting/role-permission', component: RolePermissionComponent},
      {path: 'system-setting/menu-permission', component: MenuPermissionComponent},
      {path: 'system-setting/user-manage', component: UserManageComponent},
      {path: 'system-setting/user-manage/user-form', component: UserFormComponent},
      {path: 'system-setting/user-manage/user-modify', component: ModifyUserComponent},
      {path: 'system-setting/role-manage', component: RoleManageComponent},
      {path: 'system-setting/data-dictionary', component: DataDictionaryComponent},
      {path: 'system-setting/app-menu', component: AppMenuSettingComponent},
      {path: 'system-setting/app-permission', component: AppPermissionSettingComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule {
}
