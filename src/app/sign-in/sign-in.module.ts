import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SignInRoutingModule} from './sign-in-routing.module';
import {SignInComponent} from './sign-in/sign-in.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    SignInRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule
  ]
})
export class SignInModule {
}
