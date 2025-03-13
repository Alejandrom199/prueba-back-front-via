import { Routes } from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {BienvenidaPageComponent} from './pages/bienvenida-page/bienvenida-page.component';
import {authLoginGuard} from './guards/auth-login.guard';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    canActivate: [authLoginGuard]
  },
  {
    path: 'bienvenida',
    component: BienvenidaPageComponent
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/dashboard-page/dashboard.routes')
  },
  {
    path: '**',
    redirectTo: ''
  }
];
