import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './service/auth.guard';
import {PreloadStrategyService} from './service/preload-strategy.service';

const appRoutes: Routes = [
  {
    path: 'manage',
    canActivate: [AuthGuard],
    loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule)
  },
  {path: 'sign-in', loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInModule)},
  {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
  {path: '**', loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule)}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadStrategyService, useHash: true})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
