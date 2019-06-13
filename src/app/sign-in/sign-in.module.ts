import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SignInRoutingModule} from './sign-in-routing.module';
import {SignInComponent} from './sign-in/sign-in.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    SignInRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule
  ]
})
export class SignInModule {
}
