import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Solicitud } from '../../../../core/models/api.models';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [RouterLink],
  template: `
    <section class="portal-page">
      <div class="portal-page-heading">
        <div>
          <p class="public-eyebrow">TUS POSTULACIONES</p>
          <h1>Mis solicitudes</h1>
          <p>Consulta el estado de cada solicitud y las respuestas del equipo del refugio.</p>
        </div>
        <a class="portal-action-link" routerLink="/adoptante/adopta">Buscar otra mascota →</a>
      </div>

      @if (solicitudEnviada) {
        <p class="portal-notice" role="status">Tu solicitud fue enviada. El refugio revisará la información y te contactará.</p>
      }

      @if (error()) {
        <p class="portal-message portal-error" role="alert">{{ error() }}</p>
      } @else if (cargando()) {
        <p class="portal-message" role="status">Cargando tus solicitudes…</p>
      } @else if (solicitudes().length === 0) {
        <div class="portal-message">
          Todavía no has enviado solicitudes. Cuando encuentres a tu compañero ideal, puedes comenzar aquí.
          <div class="portal-actions" style="justify-content:center">
            <a class="public-button" routerLink="/adoptante/adopta">Ver mascotas</a>
          </div>
        </div>
      } @else {
        <div class="portal-records">
          @for (solicitud of solicitudes(); track solicitud.id) {
            <article class="portal-record">
              <div>
                <h2>{{ solicitud.mascota_nombre }}</h2>
                <p>Enviada el {{ formatearFecha(solicitud.fecha_solicitud) }}</p>
                @if (solicitud.observaciones_admin) {
                  <p class="portal-admin-note"><strong>Mensaje del refugio:</strong> {{ solicitud.observaciones_admin }}</p>
                }
              </div>
              <span class="portal-badge" [class]="claseEstado(solicitud.estado_solicitud)">
                {{ solicitud.estado_solicitud }}
              </span>
            </article>
          }
        </div>
      }
    </section>
  `,
  styleUrl: './portal-page.css',
  styles: [
    `
      .portal-admin-note { margin-top: 9px !important; color: #42685a !important; }
      .portal-notice { margin-bottom: 20px; }
    `,
  ],
})
export class MisSolicitudesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly solicitudes = signal<Solicitud[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly solicitudEnviada = this.route.snapshot.queryParamMap.get('enviada') === '1';

  ngOnInit(): void {
    this.api.solicitudes().subscribe({
      next: (respuesta) => {
        this.solicitudes.set(respuesta.results);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar tus solicitudes. Inténtalo nuevamente.');
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
