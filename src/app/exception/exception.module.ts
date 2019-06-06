import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExceptionRoutingModule} from './exception-routing.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    CommonModule,
    ExceptionRoutingModule,
    NgZorroAntdModule
  ],
  exports: [PageNotFoundComponent]
})
export class ExceptionModule {
}
