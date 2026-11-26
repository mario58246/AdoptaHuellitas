import { Component, inject } from '@angular/core';
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
        <div class="adm-brand-icon">🐾</div>
        <h1>Panel del refugio</h1>
        <p>Ingresá con tu usuario de administrador para gestionar adopciones.</p>

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
          <input
            id="clave"
            class="adm-input"
            type="password"
            autocomplete="current-password"
            [(ngModel)]="clave"
            name="clave"
            required
          />
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

  usuario = '';
  clave = '';
  cargando = false;
  error = '';

  ingresar(): void {
    this.error = '';
    this.cargando = true;
    this.auth.login(this.usuario.trim(), this.clave).subscribe({
      next: () => this.router.navigateByUrl('/admin'),
      error: () => {
        this.error = 'No se pudo iniciar sesión. Revisá el usuario y la contraseña.';
        this.cargando = false;
      },
    });
  }
}
