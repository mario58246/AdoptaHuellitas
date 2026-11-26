import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
  { path: '', component: App, title: 'Adopta Huellitas' },
  {
    path: 'ingresar',
    loadComponent: () =>
      import('./modules/public/ingresar.component').then(
        (m) => m.IngresarComponent,
      ),
    title: 'Ingresar · Adopta Huellitas',
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
