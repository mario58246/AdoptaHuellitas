import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { adminStyles } from '../../admin.styles';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, RouterLink],
  template: `
    <section class="adm-login">
      <form class="adm-login-card" (ngSubmit)="ingresar()" #formulario="ngForm">
        <img class="adm-login-logo" src="assets/logo-adopta-huellitas.png" alt="Adopta Huellitas" />
        <h1>Panel del refugio</h1>
        <p>Ingresa con tu usuario de administrador para gestionar adopciones.</p>

        <div class="adm-field">
          <label for="usuario">Usuario</label>
          <input
            id="usuario"
            class="adm-input"
            type="text"
            autocomplete="username"
            [(ngModel)]="usuario"
            name="usuario"
            required
          />
        </div>
        <div class="adm-field">
          <label for="clave">Contraseña</label>
          <div class="adm-password">
            <input
              id="clave"
              class="adm-input"
              [type]="verClave ? 'text' : 'password'"
              autocomplete="current-password"
              [(ngModel)]="clave"
              name="clave"
              required
            />
            <button
              class="adm-password-toggle"
              type="button"
              (click)="toggleClave()"
              [attr.aria-label]="verClave ? 'Ocultar contraseña' : 'Ver contraseña'"
              [attr.aria-pressed]="verClave"
            >
              {{ verClave ? 'Ocultar' : 'Ver' }}
            </button>
          </div>
        </div>

        @if (error) {
          <div class="adm-error">{{ error }}</div>
        }

        <button class="adm-btn primary" type="submit" [disabled]="formulario.invalid || cargando">
          {{ cargando ? 'Ingresando…' : 'Ingresar al panel' }}
        </button>
        <a class="adm-link adm-login-volver" routerLink="/">← Volver al sitio público</a>
      </form>
    </section>
  `,
  styles: [adminStyles],
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  usuario = '';
  clave = '';
  verClave = false;
  cargando = false;
  error = '';

  toggleClave(): void {
    this.verClave = !this.verClave;
    this.cdr.markForCheck();
  }

  ingresar(): void {
    this.error = '';
    this.cargando = true;
    this.auth.login(this.usuario.trim(), this.clave).subscribe({
      next: () => {
        if (!this.auth.isAdmin()) {
          this.auth.clearSession();
          this.error = 'Esta cuenta no tiene permisos de administrador.';
          this.cargando = false;
          this.cdr.markForCheck();
          return;
        }
        this.router.navigateByUrl('/admin');
      },
      error: () => {
        this.error = 'No se pudo iniciar sesión. Verifica el usuario y la contraseña.';
        this.cargando = false;
      },
    });
  }
}
