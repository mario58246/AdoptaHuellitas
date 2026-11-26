import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { adminStyles } from './admin.styles';

interface Enlace {
  ruta: string;
  etiqueta: string;
  icono: string;
}

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="adm-layout">
      <aside class="adm-sidebar">
        <div class="adm-brand">
          <span class="adm-brand-icon">🐾</span>
          <span>Adopta <strong>Huellitas</strong><small>Panel del refugio</small></span>
        </div>

        <nav class="adm-nav" aria-label="Navegación del panel">
          <span class="adm-nav-label">Gestión</span>
          @for (enlace of enlaces; track enlace.ruta) {
            <a
              [routerLink]="enlace.ruta"
              routerLinkActive="activo"
              [routerLinkActiveOptions]="{ exact: enlace.ruta === '/admin' }"
            >
              <span class="icono" aria-hidden="true">{{ enlace.icono }}</span>
              <span class="texto">{{ enlace.etiqueta }}</span>
            </a>
          }
        </nav>

        <div class="adm-sidebar-foot">Adopciones responsables · 24 meses de acompañamiento</div>
      </aside>

      <div class="adm-main">
        <header class="adm-topbar">
          <div class="adm-breadcrumb"><strong>Refugio</strong> / Panel de administración</div>
          <div class="adm-user">
            <span class="adm-avatar">{{ inicial }}</span>
            <span>{{ auth.username }}</span>
            <button class="adm-btn ghost small" type="button" (click)="auth.logout()">Salir</button>
          </div>
        </header>
        <main class="adm-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [adminStyles],
})
export class AdminShellComponent {
  readonly auth = inject(AuthService);

  readonly enlaces: Enlace[] = [
    { ruta: '/admin', etiqueta: 'Resumen', icono: '◧' },
    { ruta: '/admin/mascotas', etiqueta: 'Mascotas', icono: '🐾' },
    { ruta: '/admin/solicitudes', etiqueta: 'Solicitudes', icono: '✉' },
    { ruta: '/admin/seguimiento', etiqueta: 'Seguimiento', icono: '◉' },
    { ruta: '/admin/historial', etiqueta: 'Historial médico', icono: '✚' },
  ];

  get inicial(): string {
    return this.auth.username.charAt(0).toUpperCase();
  }
}
