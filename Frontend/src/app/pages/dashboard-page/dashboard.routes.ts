import { Routes } from "@angular/router";
import { DashboardPageComponent } from "./dashboard-page.component";
import { MantenimientoUsuariosPageComponent } from "./mantenimiento-usuarios-page/mantenimiento-usuarios-page.component";
import { AdminPageComponent } from "./admin-page/admin-page.component";

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    children: [
      {
        path:'index',
        component: AdminPageComponent
      },
      {
        path: 'mantenimiento',
        component: MantenimientoUsuariosPageComponent
      },
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
]

export default dashboardRoutes

