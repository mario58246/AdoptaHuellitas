import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    title: 'Ingresar · Adopta Huellitas',
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Resumen · Adopta Huellitas',
      },
      {
        path: 'mascotas',
        loadComponent: () =>
          import('./pages/mascotas/mascotas-admin.component').then(
            (m) => m.MascotasAdminComponent,
          ),
        title: 'Mascotas · Adopta Huellitas',
      },
      {
        path: 'solicitudes',
        loadComponent: () =>
          import('./pages/solicitudes/solicitudes-admin.component').then(
            (m) => m.SolicitudesAdminComponent,
          ),
        title: 'Solicitudes · Adopta Huellitas',
      },
      {
        path: 'seguimiento',
        loadComponent: () =>
          import('./pages/seguimiento/seguimiento-admin.component').then(
            (m) => m.SeguimientoAdminComponent,
          ),
        title: 'Seguimiento · Adopta Huellitas',
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/historial/historial-admin.component').then(
            (m) => m.HistorialAdminComponent,
          ),
        title: 'Historial médico · Adopta Huellitas',
      },
    ],
  },
];
