import { Routes } from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {BienvenidaPageComponent} from './pages/bienvenida-page/bienvenida-page.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page.component';
import {
  MantenimientoUsuariosPageComponent
} from './pages/mantenimiento-usuarios-page/mantenimiento-usuarios-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
  },
  {
    path: 'index',
    component: BienvenidaPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
  },
  {
    path: 'mantenimiento',
    component: MantenimientoUsuariosPageComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];
