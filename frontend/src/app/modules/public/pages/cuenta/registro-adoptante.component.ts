import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegistroAdoptante } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-registro-adoptante',
  imports: [FormsModule, RouterLink],
  template: `
    <main class="account-page">
      <section class="account-card">
        <p class="public-eyebrow">UN NUEVO COMIENZO</p>
        <h1>Crea tu cuenta</h1>
        <p class="account-lead">Regístrate para iniciar tus solicitudes de adopción y consultar su estado.</p>

        <form class="account-form" (ngSubmit)="registrar()" #formulario="ngForm">
          <div class="account-name-row">
            <div class="account-field">
              <label for="registro-nombre">Nombre</label>
              <input id="registro-nombre" name="nombre" [(ngModel)]="nombre" autocomplete="given-name" required />
            </div>
            <div class="account-field">
              <label for="registro-apellido">Apellido</label>
              <input id="registro-apellido" name="apellido" [(ngModel)]="apellido" autocomplete="family-name" required />
            </div>
          </div>

          <div class="account-field">
            <label for="registro-usuario">Nombre de usuario</label>
            <input
              id="registro-usuario"
              name="usuario"
              [(ngModel)]="usuario"
              autocomplete="username"
              minlength="3"
              required
            />
          </div>

          <div class="account-field">
            <label for="registro-correo">Correo electrónico</label>
            <input
              id="registro-correo"
              name="correo"
              [(ngModel)]="correo"
              type="email"
              autocomplete="email"
              required
            />
          </div>

          <div class="account-field">
            <label for="registro-clave">Contraseña</label>
            <div class="account-password">
              <input
                id="registro-clave"
                name="clave"
                [(ngModel)]="clave"
                [type]="verClave ? 'text' : 'password'"
                autocomplete="new-password"
                minlength="8"
                required
              />
              <button type="button" (click)="verClave = !verClave">
                {{ verClave ? 'Ocultar' : 'Ver' }}
              </button>
            </div>
          </div>

          <div class="account-field">
            <label for="registro-confirmar-clave">Confirma tu contraseña</label>
            <input
              id="registro-confirmar-clave"
              name="confirmarClave"
              [(ngModel)]="confirmarClave"
              type="password"
              autocomplete="new-password"
              required
            />
          </div>

          @if (error) {
            <p class="account-error" role="alert">{{ error }}</p>
          }

          <button class="public-button account-submit" type="submit" [disabled]="formulario.invalid || cargando">
            {{ cargando ? 'Creando cuenta…' : 'Crear cuenta' }}
          </button>
        </form>

        <p class="account-switch">
          ¿Ya tienes una cuenta? <a routerLink="/adoptante/ingresar">Ingresar</a>
        </p>
        <a class="account-back" routerLink="/ingresar">← Volver a las opciones de acceso</a>
      </section>
    </main>
  `,
  styleUrl: './cuenta-auth.css',
})
export class RegistroAdoptanteComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  nombre = '';
  apellido = '';
  usuario = '';
  correo = '';
  clave = '';
  confirmarClave = '';
  verClave = false;
  cargando = false;
  error = '';

  registrar(): void {
    this.error = '';
    if (this.clave !== this.confirmarClave) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;
    const datos: RegistroAdoptante = {
      username: this.usuario.trim(),
      email: this.correo.trim(),
      first_name: this.nombre.trim(),
      last_name: this.apellido.trim(),
      password: this.clave,
      password_confirmacion: this.confirmarClave,
    };

    this.auth.registrar(datos).subscribe({
      next: () => {
        this.router.navigate(['/adoptante/ingresar'], {
          queryParams: { registrado: '1' },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.mensajeError(error);
        this.cargando = false;
      },
    });
  }

  private mensajeError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Inténtalo nuevamente.';
    }

    const datos = error.error as Record<string, unknown> | null;
    if (!datos) {
      return 'No se pudo crear la cuenta. Revisa los datos e inténtalo nuevamente.';
    }

    const mensajes = Object.values(datos).flatMap((valor) =>
      Array.isArray(valor) ? valor.map(String) : typeof valor === 'string' ? [valor] : [],
    );
    return mensajes[0] ?? 'No se pudo crear la cuenta. Revisa los datos e inténtalo nuevamente.';
  }
}
