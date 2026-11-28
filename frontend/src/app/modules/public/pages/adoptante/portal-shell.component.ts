import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-portal-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="portal-shell">
      <header class="portal-header">
        <a class="portal-brand" routerLink="/adoptante/inicio">
          <img src="assets/logo-adopta-huellitas.png" alt="" aria-hidden="true" />
          <span>Adopta <strong>Huellitas</strong></span>
        </a>
        <div class="portal-user">
          <span class="portal-greeting">Hola, {{ auth.nombre }}</span>
          <button type="button" (click)="cerrarSesion()">Cerrar sesión</button>
        </div>
      </header>

      <div class="portal-layout">
        <aside class="portal-sidebar">
          <p class="portal-nav-title">MI ESPACIO</p>
          <nav aria-label="Navegación del adoptante">
            <a routerLink="/adoptante/inicio" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
              <span aria-hidden="true">⌂</span>Inicio
            </a>
            <a routerLink="/adoptante/adopta" routerLinkActive="active">
              <span aria-hidden="true">♡</span>Adopta
            </a>
            <a routerLink="/adoptante/post-adopcion" routerLinkActive="active">
              <span aria-hidden="true">✓</span>Post adopción
            </a>
            <a routerLink="/adoptante/solicitudes" routerLinkActive="active">
              <span aria-hidden="true">▤</span>Mis solicitudes
            </a>
            <span class="portal-nav-divider"></span>
            <a routerLink="/adoptante/como-funciona" routerLinkActive="active">
              <span aria-hidden="true">ⓘ</span>Cómo funciona
            </a>
            <a routerLink="/adoptante/historias" routerLinkActive="active">
              <span aria-hidden="true">✳</span>Historias
            </a>
          </nav>
          <div class="portal-sidebar-note">
            <strong>¿Necesitas ayuda?</strong>
            <p>Estamos para acompañarte en cada paso.</p>
            <a href="mailto:ag123angie1@gmail.com">Contactar al refugio →</a>
          </div>
        </aside>

        <main class="portal-main">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrl: './portal-shell.component.css',
})
export class PortalShellComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.auth.clearSession();
    this.router.navigateByUrl('/');
  }
}
