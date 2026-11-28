import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-adoptante',
  imports: [FormsModule, RouterLink],
  template: `
    <main class="account-page">
      <section class="account-card">
        <p class="public-eyebrow">TU HISTORIA CONTINÚA</p>
        <h1>Ingresa a tu cuenta</h1>
        <p class="account-lead">Accede para consultar tus solicitudes y mantenerte al tanto de tu proceso.</p>

        @if (registrado) {
          <p class="account-success" role="status">Cuenta creada. Ya puedes iniciar sesión.</p>
        }

        <form class="account-form" (ngSubmit)="ingresar()" #formulario="ngForm">
          <div class="account-field">
            <label for="adoptante-usuario">Usuario</label>
            <input
              id="adoptante-usuario"
              name="usuario"
              [(ngModel)]="usuario"
              autocomplete="username"
              required
            />
          </div>

          <div class="account-field">
            <label for="adoptante-clave">Contraseña</label>
            <div class="account-password">
              <input
                id="adoptante-clave"
                name="clave"
                [(ngModel)]="clave"
                [type]="verClave ? 'text' : 'password'"
                autocomplete="current-password"
                required
              />
              <button type="button" (click)="verClave = !verClave">
                {{ verClave ? 'Ocultar' : 'Ver' }}
              </button>
            </div>
          </div>

          @if (error) {
            <p class="account-error" role="alert">{{ error }}</p>
          }

          <button class="public-button account-submit" type="submit" [disabled]="formulario.invalid || cargando">
            {{ cargando ? 'Ingresando…' : 'Ingresar' }}
          </button>
        </form>

        <p class="account-switch">
          ¿Aún no tienes cuenta? <a routerLink="/adoptante/registro">Crear cuenta</a>
        </p>
        <a class="account-back" routerLink="/ingresar">← Volver a las opciones de acceso</a>
      </section>
    </main>
  `,
  styleUrl: './cuenta-auth.css',
})
export class LoginAdoptanteComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly registrado = this.route.snapshot.queryParamMap.get('registrado') === '1';
  usuario = '';
  clave = '';
  verClave = false;
  cargando = false;
  error = '';

  ingresar(): void {
    this.error = '';
    this.cargando = true;
    this.auth.login(this.usuario.trim(), this.clave).subscribe({
      next: () => {
        if (this.auth.isAdmin()) {
          this.auth.clearSession();
          this.error = 'Esta cuenta corresponde al equipo administrador. Ingresa desde el acceso del refugio.';
          this.cargando = false;
          return;
        }
        this.router.navigateByUrl('/adoptante/inicio');
      },
      error: (error: HttpErrorResponse) => {
        this.error =
          error.status === 0
            ? 'No se pudo conectar con el servidor. Inténtalo nuevamente.'
            : 'Usuario o contraseña incorrectos.';
        this.cargando = false;
      },
    });
  }
}
