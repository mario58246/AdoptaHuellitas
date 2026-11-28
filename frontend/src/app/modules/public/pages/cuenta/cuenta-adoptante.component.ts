import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-cuenta-adoptante',
  imports: [RouterLink],
  template: `
    <main class="account-page">
      <section class="account-card">
        <p class="public-eyebrow">MI CUENTA</p>
        <h1>Hola, {{ auth.nombre }}</h1>
        <div class="account-profile">
          <p>Has iniciado sesión correctamente. Desde aquí podrás consultar tus solicitudes de adopción.</p>
          <p>El portal de solicitudes y seguimiento estará disponible próximamente.</p>
        </div>
        <div class="account-actions">
          <a class="public-button" routerLink="/catalogo">Explorar mascotas</a>
          <button class="public-button secondary" type="button" (click)="cerrarSesion()">Cerrar sesión</button>
        </div>
      </section>
    </main>
  `,
  styleUrl: './cuenta-auth.css',
})
export class CuentaAdoptanteComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.auth.clearSession();
    this.router.navigateByUrl('/');
  }
}
