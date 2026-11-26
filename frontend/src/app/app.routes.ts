import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/public/public-shell.component').then(
        (module) => module.PublicShellComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/public/pages/inicio/inicio.component').then(
            (module) => module.InicioComponent,
          ),
        title: 'Inicio · Adopta Huellitas',
        pathMatch: 'full',
      },
      {
        path: 'catalogo',
        loadComponent: () =>
          import('./modules/public/pages/catalogo/catalogo.component').then(
            (module) => module.CatalogoComponent,
          ),
        title: 'Mascotas en adopción · Adopta Huellitas',
      },
      {
        path: 'como-funciona',
        loadComponent: () =>
          import('./modules/public/pages/como-funciona/como-funciona.component').then(
            (module) => module.ComoFuncionaComponent,
          ),
        title: 'Cómo funciona · Adopta Huellitas',
      },
      {
        path: 'historias',
        loadComponent: () =>
          import('./modules/public/pages/historias/historias.component').then(
            (module) => module.HistoriasComponent,
          ),
        title: 'Historias · Adopta Huellitas',
      },
    ],
  },
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
