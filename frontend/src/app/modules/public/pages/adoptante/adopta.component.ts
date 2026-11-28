import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Mascota, SolicitudInput } from '../../../../core/models/api.models';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import {
  MascotaPublica,
  MascotasPublicasService,
} from '../../services/mascotas-publicas.service';

@Component({
  selector: 'app-adopta',
  imports: [FormsModule, RouterLink],
  template: `
    <section class="portal-page">
      <div class="portal-page-heading">
        <div>
          <p class="public-eyebrow">UN NUEVO COMIENZO</p>
          <h1>Encuentra a tu compañero</h1>
          <p>Conoce a los perros y gatos disponibles y cuéntanos por qué quieres adoptar.</p>
        </div>
      </div>

      @if (errorCarga()) {
        <p class="portal-message portal-error" role="alert">{{ errorCarga() }}</p>
      } @else if (cargando()) {
        <p class="portal-message" role="status">Buscando compañeros disponibles…</p>
      } @else if (mascotas().length === 0) {
        <div class="portal-message">
          <p>En este momento no hay mascotas disponibles para adoptar. Vuelve pronto para conocer novedades.</p>
          <a class="portal-action-link" routerLink="/adoptante/historias">Leer historias</a>
        </div>
      } @else {
        <div class="portal-pet-grid">
          @for (mascota of mascotas(); track mascota.id) {
            <article class="portal-pet-card">
              <img
                [src]="mascota.imagen"
                [alt]="mascota.nombre + ', ' + mascota.especie.toLowerCase()"
                loading="lazy"
                (error)="usarImagenAlternativa(mascota)"
              />
              <div class="portal-pet-card-body">
                <h2>{{ mascota.nombre }}</h2>
                <p>{{ mascota.especie }} · {{ mascota.edad }} · {{ mascota.tamano }}</p>
                <p>{{ mascota.historia }}</p>
                <button class="public-button" type="button" (click)="seleccionar(mascota)">
                  Quiero adoptar
                </button>
              </div>
            </article>
          }
        </div>
      }

      @if (seleccionada(); as mascota) {
        <div class="portal-modal-backdrop" (click)="cerrarFormulario($event)">
          <section
            class="portal-application-modal"
            role="dialog"
            aria-modal="true"
            [attr.aria-label]="'Solicitud para adoptar a ' + mascota.nombre"
          >
            <button class="portal-modal-close" type="button" (click)="seleccionada.set(null)" aria-label="Cerrar formulario">×</button>
            <p class="public-eyebrow">SOLICITUD DE ADOPCIÓN</p>
            <h2>Cuéntanos sobre tu hogar</h2>
            <p class="portal-modal-intro">Solicitud para conocer a <strong>{{ mascota.nombre }}</strong>. Nos pondremos en contacto contigo.</p>

            <form class="portal-form" (ngSubmit)="enviarSolicitud()" #formulario="ngForm">
              <div class="portal-form-grid">
                <div class="portal-field">
                  <label for="solicitud-nombre">Nombre completo</label>
                  <input id="solicitud-nombre" name="nombre" [(ngModel)]="nombre" required />
                </div>
                <div class="portal-field">
                  <label for="solicitud-correo">Correo</label>
                  <input id="solicitud-correo" name="correo" [(ngModel)]="correo" type="email" required />
                </div>
                <div class="portal-field">
                  <label for="solicitud-telefono">Teléfono</label>
                  <input id="solicitud-telefono" name="telefono" [(ngModel)]="telefono" type="tel" autocomplete="tel" required />
                </div>
                <div class="portal-field">
                  <label for="solicitud-direccion">Dirección de residencia</label>
                  <input id="solicitud-direccion" name="direccion" [(ngModel)]="direccion" autocomplete="street-address" required />
                </div>
                <div class="portal-field full">
                  <label for="solicitud-hogar">¿Cómo es tu hogar?</label>
                  <textarea id="solicitud-hogar" name="hogar" [(ngModel)]="hogar" placeholder="Espacio, personas que viven contigo y rutina diaria"></textarea>
                </div>
                <div class="portal-field full">
                  <label for="solicitud-mascotas">¿Convives con otras mascotas?</label>
                  <textarea id="solicitud-mascotas" name="otrasMascotas" [(ngModel)]="otrasMascotas" placeholder="Cuéntanos sobre ellas o indica que no tienes"></textarea>
                </div>
                <div class="portal-field full">
                  <label for="solicitud-motivo">¿Por qué quieres adoptar a {{ mascota.nombre }}?</label>
                  <textarea id="solicitud-motivo" name="motivo" [(ngModel)]="motivo" required></textarea>
                </div>
              </div>

              @if (errorEnvio()) {
                <p class="portal-message portal-error" role="alert">{{ errorEnvio() }}</p>
              }

              <div class="portal-modal-actions">
                <button class="public-button secondary" type="button" (click)="seleccionada.set(null)">Cancelar</button>
                <button class="public-button portal-submit" type="submit" [disabled]="formulario.invalid || enviando()">
                  {{ enviando() ? 'Enviando…' : 'Enviar solicitud' }}
                </button>
              </div>
            </form>
          </section>
        </div>
      }
    </section>
  `,
  styleUrl: './portal-page.css',
  styles: [
    `
      .portal-modal-backdrop { padding: 24px; display: grid; place-items: center; position: fixed; inset: 0; z-index: 20; overflow-y: auto; background: rgb(16 40 37 / 55%); }
      .portal-application-modal { width: min(100%, 680px); max-height: calc(100vh - 48px); padding: 28px; position: relative; overflow-y: auto; border-radius: 16px; background: #fff; box-shadow: 0 24px 70px rgb(0 0 0 / 20%); }
      .portal-modal-close { width: 34px; height: 34px; position: absolute; top: 16px; right: 16px; border: 1px solid var(--public-line); border-radius: 50%; color: var(--public-muted); background: white; font-size: 22px; cursor: pointer; }
      .portal-application-modal h2 { margin: 0 0 7px; font: 800 24px 'Franklin Gothic Medium','Trebuchet MS',sans-serif; }
      .portal-modal-intro { margin: 0 0 18px; color: var(--public-muted); font-size: 12px; line-height: 1.55; }
      .portal-modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
      .portal-modal-actions button { min-height: 41px; }
      @media(max-width:600px){.portal-modal-backdrop{padding:10px}.portal-application-modal{max-height:calc(100vh - 20px);padding:22px 17px}.portal-modal-actions{flex-direction:column-reverse}.portal-modal-actions button{width:100%}}
    `,
  ],
})
export class AdoptaComponent implements OnInit {
  private readonly mascotasService = inject(MascotasPublicasService);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly mascotas = signal<MascotaPublica[]>([]);
  readonly seleccionada = signal<MascotaPublica | null>(null);
  readonly cargando = signal(true);
  readonly enviando = signal(false);
  readonly errorCarga = signal('');
  readonly errorEnvio = signal('');

  nombre = this.auth.nombre;
  correo = this.auth.email;
  telefono = '';
  direccion = '';
  hogar = '';
  otrasMascotas = '';
  motivo = '';

  ngOnInit(): void {
    this.mascotasService.disponibles().subscribe({
      next: (mascotas) => {
        this.mascotas.set(mascotas);
        this.cargando.set(false);
      },
      error: () => {
        this.errorCarga.set('No pudimos cargar los animales disponibles. Inténtalo nuevamente.');
        this.cargando.set(false);
      },
    });
  }

  seleccionar(mascota: MascotaPublica): void {
    this.seleccionada.set(mascota);
    this.errorEnvio.set('');
  }

  cerrarFormulario(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.seleccionada.set(null);
  }

  usarImagenAlternativa(mascota: MascotaPublica): void {
    mascota.imagen = mascota.imagenAlternativa;
  }

  enviarSolicitud(): void {
    const mascota = this.seleccionada();
    if (!mascota) return;

    this.enviando.set(true);
    this.errorEnvio.set('');
    const datos: SolicitudInput = {
      mascota: mascota.id,
      nombre_adoptante: this.nombre.trim(),
      correo_contacto: this.correo.trim(),
      telefono: this.telefono.trim(),
      direccion_residencia: this.direccion.trim(),
      caracteristicas_hogar: this.hogar.trim(),
      convivencia_otras_mascotas: this.otrasMascotas.trim(),
      motivo_adopcion: this.motivo.trim(),
    };

    this.api.crearSolicitud(datos).subscribe({
      next: () => this.router.navigate(['/adoptante/solicitudes'], { queryParams: { enviada: '1' } }),
      error: (error: HttpErrorResponse) => {
        this.errorEnvio.set(
          error.status === 0
            ? 'No se pudo conectar con el servidor. Inténtalo nuevamente.'
            : 'No pudimos enviar la solicitud. Comprueba los datos y que la mascota siga disponible.',
        );
        this.enviando.set(false);
      },
    });
  }
}
