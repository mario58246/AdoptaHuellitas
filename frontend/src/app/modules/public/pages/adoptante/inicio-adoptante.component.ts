import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Seguimiento, Solicitud } from '../../../../core/models/api.models';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-inicio-adoptante',
  imports: [RouterLink],
  template: `
    <section class="portal-page">
      <div class="portal-page-heading">
        <div>
          <p class="public-eyebrow">TU ESPACIO DE ADOPCIÓN</p>
          <h1>Hola, {{ nombre }} <span aria-hidden="true">🐾</span></h1>
          <p>Un lugar para encontrar a tu compañero y acompañar cada paso de su nueva vida.</p>
        </div>
        <a class="public-button" routerLink="/adoptante/adopta">Encontrar compañero <span>→</span></a>
      </div>

      @if (error()) {
        <p class="portal-message portal-error" role="alert">{{ error() }}</p>
      } @else if (cargando()) {
        <p class="portal-message" role="status">Cargando tu espacio…</p>
      } @else {
        <div class="portal-grid">
          <article class="portal-stat">
            <span class="portal-stat-label">Mis solicitudes</span>
            <strong>{{ solicitudes().length }}</strong>
            <small>{{ pendientes() }} pendientes de respuesta</small>
          </article>
          <article class="portal-stat">
            <span class="portal-stat-label">Adopciones aprobadas</span>
            <strong>{{ aprobadas() }}</strong>
            <small>Un nuevo comienzo compartido</small>
          </article>
          <article class="portal-stat">
            <span class="portal-stat-label">Reportes de seguimiento</span>
            <strong>{{ reportesPendientes() }}</strong>
            <small>Pendientes o en revisión</small>
          </article>
        </div>

        <section class="portal-home-section">
          <div class="portal-home-title">
            <div>
              <p class="public-eyebrow">SIGUIENTE PASO</p>
              <h2 class="portal-section-title">Acompañamos cada encuentro</h2>
            </div>
            <a class="portal-text-link" routerLink="/adoptante/como-funciona">Ver cómo funciona →</a>
          </div>
          <div class="portal-home-cards">
            <a class="portal-home-card" routerLink="/adoptante/adopta">
              <span class="portal-home-icon">♡</span>
              <strong>Adopta</strong>
              <span>Conoce a los animales que buscan un hogar.</span>
            </a>
            <a class="portal-home-card" routerLink="/adoptante/solicitudes">
              <span class="portal-home-icon icon-blue">▤</span>
              <strong>Mis solicitudes</strong>
              <span>Consulta los estados y las respuestas del refugio.</span>
            </a>
            <a class="portal-home-card" routerLink="/adoptante/post-adopcion">
              <span class="portal-home-icon icon-peach">✓</span>
              <strong>Post adopción</strong>
              <span>Envía novedades y evidencias de seguimiento.</span>
            </a>
          </div>
        </section>

        @if (solicitudes().length) {
          <section class="portal-home-section">
            <div class="portal-home-title">
              <h2 class="portal-section-title">Actividad reciente</h2>
              <a class="portal-text-link" routerLink="/adoptante/solicitudes">Ver todas →</a>
            </div>
            <div class="portal-records">
              @for (solicitud of solicitudes().slice(0, 3); track solicitud.id) {
                <article class="portal-record">
                  <div>
                    <h3>{{ solicitud.mascota_nombre }}</h3>
                    <p>Solicitud enviada el {{ formatearFecha(solicitud.fecha_solicitud) }}</p>
                  </div>
                  <span class="portal-badge" [class]="claseEstado(solicitud.estado_solicitud)">
                    {{ solicitud.estado_solicitud }}
                  </span>
                </article>
              }
            </div>
          </section>
        }
      }
    </section>
  `,
  styleUrl: './portal-page.css',
  styles: [
    `
      .portal-home-section { margin-top: 32px; }
      .portal-home-title { margin-bottom: 15px; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
      .portal-home-title .public-eyebrow { margin-bottom: 8px; }
      .portal-home-title .portal-section-title { margin-bottom: 0; }
      .portal-text-link { color: var(--public-green); font-size: 12px; font-weight: 700; white-space: nowrap; }
      .portal-home-cards { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; }
      .portal-home-card { min-height: 175px; padding: 18px; display: flex; flex-direction: column; align-items: flex-start; gap: 9px; border: 1px solid var(--public-line); border-radius: 11px; background: white; transition: transform .18s ease, box-shadow .18s ease; }
      .portal-home-card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgb(23 49 46 / 7%); }
      .portal-home-icon { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 11px; color: var(--public-green); background: #e4f4ec; font-size: 20px; }
      .portal-home-icon.icon-blue { color: #38798a; background: #e8f2f4; }
      .portal-home-icon.icon-peach { color: #b9664b; background: #faeee8; }
      .portal-home-card strong { font: 700 15px 'Franklin Gothic Medium','Trebuchet MS',sans-serif; }
      .portal-home-card > span:last-child { color: var(--public-muted); font-size: 11px; line-height: 1.55; }
      @media(max-width:700px){.portal-home-cards{grid-template-columns:1fr}.portal-home-card{min-height:0}.portal-home-title{align-items:flex-start;flex-direction:column}}
    `,
  ],
})
export class InicioAdoptanteComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  readonly solicitudes = signal<Solicitud[]>([]);
  readonly seguimientos = signal<Seguimiento[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly pendientes = computed(
    () => this.solicitudes().filter((item) => item.estado_solicitud === 'Pendiente').length,
  );
  readonly aprobadas = computed(
    () => this.solicitudes().filter((item) => item.estado_solicitud === 'Aprobada').length,
  );
  readonly reportesPendientes = computed(
    () =>
      this.seguimientos().filter(
        (item) => item.estado === 'Pendiente' || item.estado === 'Vencido',
      ).length,
  );

  get nombre(): string {
    return this.auth.nombre;
  }

  ngOnInit(): void {
    forkJoin({
      solicitudes: this.api.solicitudes(),
      seguimientos: this.api.seguimientos(),
    }).subscribe({
      next: (respuesta) => {
        this.solicitudes.set(respuesta.solicitudes.results);
        this.seguimientos.set(respuesta.seguimientos.results);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar el resumen de tu cuenta. Inténtalo nuevamente.');
        this.cargando.set(false);
      },
    });
  }

  formatearFecha(fecha: string): string {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(fecha));
  }

  claseEstado(estado: Solicitud['estado_solicitud']): string {
    if (estado === 'Aprobada') return 'approved';
    if (estado === 'Rechazada') return 'rejected';
    if (estado === 'En Revisión') return 'review';
    return 'pending';
  }

}
