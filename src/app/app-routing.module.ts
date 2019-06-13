import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

const appRoutes: Routes = [
  {path: 'manage', loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule)},
  {path: 'sign-in', loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInModule)},
  {path: '', redirectTo: 'manage', pathMatch: 'full'},
  {path: '**', loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule)}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
