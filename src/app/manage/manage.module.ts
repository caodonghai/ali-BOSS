import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ManageRoutingModule} from './manage-routing.module';
import {LayoutComponent} from './layout/layout.component';
import {HomeComponent} from './home/home.component';
import {TenantManageComponent} from './tenant-manage/tenant-manage.component';
import {InformationFeedbackComponent} from './information-feedback/information-feedback.component';
import {InformationNoticeComponent} from './information-notice/information-notice.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {NavHeaderComponent} from './layout/nav-header/nav-header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {PackageManageComponent} from './package-manage/package-manage.component';
import {SalesStatisticsComponent} from './sales-statistics/sales-statistics.component';
import {SharedModule} from '../shared/shared.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {ProductPercentComponent} from './home/product-percent/product-percent.component';
import {DistributeChartComponent} from './home/distribute-chart/distribute-chart.component';
import {ActualUseComponent} from './home/actual-use/actual-use.component';
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
import {SystemSettingService} from './service/systemSetting.service';
import {ManageService} from './service/manage.service';
import {ExportService} from './service/export.service';

@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent,
    TenantManageComponent,
    InformationFeedbackComponent,
    InformationNoticeComponent,
    NavHeaderComponent,
    PackageManageComponent,
    SalesStatisticsComponent,
    ProductPercentComponent,
    DistributeChartComponent,
    ActualUseComponent,
    MenuSettingComponent,
    AddMenuComponent,
    RolePermissionComponent,
    MenuPermissionComponent,
    UserManageComponent,
    UserFormComponent,
    ModifyUserComponent,
    RoleManageComponent,
    DataDictionaryComponent,
    AppMenuSettingComponent,
    AppPermissionSettingComponent
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    FormsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    NgxEchartsModule
  ]
})
export class ManageModule {
}
