import { Routes } from '@angular/router';
import { adoptanteGuard } from './core/guards/adoptante.guard';

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
      {
        path: 'adoptante/ingresar',
        loadComponent: () =>
          import('./modules/public/pages/cuenta/login-adoptante.component').then(
            (module) => module.LoginAdoptanteComponent,
          ),
        title: 'Ingresar como adoptante · Adopta Huellitas',
      },
      {
        path: 'adoptante/registro',
        loadComponent: () =>
          import('./modules/public/pages/cuenta/registro-adoptante.component').then(
            (module) => module.RegistroAdoptanteComponent,
          ),
        title: 'Crear cuenta · Adopta Huellitas',
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
    path: 'adoptante',
    canActivateChild: [adoptanteGuard],
    loadComponent: () =>
      import('./modules/public/pages/adoptante/portal-shell.component').then(
        (module) => module.PortalShellComponent,
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./modules/public/pages/adoptante/inicio-adoptante.component').then(
            (module) => module.InicioAdoptanteComponent,
          ),
        title: 'Inicio · Mi espacio · Adopta Huellitas',
      },
      {
        path: 'adopta',
        loadComponent: () =>
          import('./modules/public/pages/adoptante/adopta.component').then(
            (module) => module.AdoptaComponent,
          ),
        title: 'Adopta · Mi espacio · Adopta Huellitas',
      },
      {
        path: 'post-adopcion',
        loadComponent: () =>
          import('./modules/public/pages/adoptante/post-adopcion.component').then(
            (module) => module.PostAdopcionComponent,
          ),
        title: 'Post adopción · Mi espacio · Adopta Huellitas',
      },
      {
        path: 'solicitudes',
        loadComponent: () =>
          import('./modules/public/pages/adoptante/mis-solicitudes.component').then(
            (module) => module.MisSolicitudesComponent,
          ),
        title: 'Mis solicitudes · Mi espacio · Adopta Huellitas',
      },
      {
        path: 'como-funciona',
        loadComponent: () =>
          import('./modules/public/pages/como-funciona/como-funciona.component').then(
            (module) => module.ComoFuncionaComponent,
          ),
        title: 'Cómo funciona · Mi espacio · Adopta Huellitas',
      },
      {
        path: 'historias',
        loadComponent: () =>
          import('./modules/public/pages/historias/historias.component').then(
            (module) => module.HistoriasComponent,
          ),
        title: 'Historias · Mi espacio · Adopta Huellitas',
      },
      { path: 'cuenta', pathMatch: 'full', redirectTo: 'inicio' },
    ],
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
