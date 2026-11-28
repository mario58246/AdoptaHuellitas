import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Seguimiento } from '../../../../core/models/api.models';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-post-adopcion',
  imports: [FormsModule, RouterLink],
  template: `
    <section class="portal-page">
      <div class="portal-page-heading">
        <div>
          <p class="public-eyebrow">SEGUIMOS CERCA</p>
          <h1>Post adopción</h1>
          <p>Comparte cómo va la adaptación y envía las evidencias de seguimiento de tu compañero.</p>
        </div>
      </div>

      <div class="portal-notice">
        El seguimiento acompaña los primeros 24 meses. Los reportes se habilitan cuando el refugio aprueba una solicitud.
      </div>

      @if (errorCarga()) {
        <p class="portal-message portal-error" role="alert">{{ errorCarga() }}</p>
      } @else if (cargando()) {
        <p class="portal-message" role="status">Cargando tus reportes…</p>
      } @else if (reportes().length === 0) {
        <div class="portal-message">
          Aún no tienes reportes de seguimiento. Cuando una de tus solicitudes sea aprobada, los encontrarás aquí.
          <div class="portal-actions" style="justify-content:center">
            <a class="portal-action-link" routerLink="/adoptante/solicitudes">Ver mis solicitudes</a>
          </div>
        </div>
      } @else {
        <div class="portal-records">
          @for (reporte of reportes(); track reporte.id) {
            <article class="portal-record">
              <div>
                <h2>{{ reporte.mascota_nombre }} · Reporte {{ reporte.numero_reporte }}</h2>
                <p>Seguimiento del mes {{ reporte.mes_programado }} · Fecha límite {{ formatearFecha(reporte.fecha_limite) }}</p>
                @if (reporte.retroalimentacion) {
                  <p class="portal-feedback"><strong>Mensaje del refugio:</strong> {{ reporte.retroalimentacion }}</p>
                }
                @if (reporte.observaciones_adoptante) {
                  <p class="portal-record-meta">Tu nota: {{ reporte.observaciones_adoptante }}</p>
                }
              </div>
              <span class="portal-badge" [class]="claseEstado(reporte)">
                {{ reporte.estado }}
              </span>

              @if (reporte.estado === 'Pendiente' || reporte.estado === 'Vencido') {
                <button class="portal-action-link portal-report-toggle" type="button" (click)="alternarFormulario(reporte.id)">
                  {{ formularioAbierto() === reporte.id ? 'Cancelar envío' : 'Enviar evidencia' }}
                </button>
              }

              @if (formularioAbierto() === reporte.id) {
                <form class="portal-form portal-report-form" (ngSubmit)="enviarEvidencia(reporte)">
                  <div class="portal-form-grid">
                    <div class="portal-field full">
                      <label [for]="'archivo-' + reporte.id">Adjunta una foto o video</label>
                      <input
                        class="portal-file"
                        [id]="'archivo-' + reporte.id"
                        type="file"
                        accept="image/*,video/*"
                        (change)="seleccionarArchivo($event)"
                      />
                    </div>
                    <div class="portal-field full">
                      <label [for]="'url-' + reporte.id">O pega un enlace a tu evidencia</label>
                      <input
                        [id]="'url-' + reporte.id"
                        name="url-{{ reporte.id }}"
                        [(ngModel)]="url"
                        type="url"
                        placeholder="https://..."
                      />
                    </div>
                    <div class="portal-field full">
                      <label [for]="'nota-' + reporte.id">Cuéntanos cómo va la adaptación</label>
                      <textarea
                        [id]="'nota-' + reporte.id"
                        name="nota-{{ reporte.id }}"
                        [(ngModel)]="observaciones"
                        placeholder="Comparte una novedad sobre su bienestar"
                      ></textarea>
                    </div>
                  </div>
                  @if (errorEnvio()) {
                    <p class="portal-message portal-error" role="alert">{{ errorEnvio() }}</p>
                  }
                  <button class="public-button portal-submit" type="submit" [disabled]="enviando()">
                    {{ enviando() ? 'Enviando…' : 'Enviar reporte' }}
                  </button>
                </form>
              }
            </article>
          }
        </div>
      }
    </section>
  `,
  styleUrl: './portal-page.css',
  styles: [
    `
      .portal-feedback { margin-top: 9px !important; color: #42685a !important; }
      .portal-report-toggle { grid-column: 1 / -1; justify-self: start; cursor: pointer; }
      .portal-report-form { grid-column: 1 / -1; width: 100%; }
      .portal-report-form .public-button { justify-self: start; }
    `,
  ],
})
export class PostAdopcionComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly reportes = signal<Seguimiento[]>([]);
  readonly cargando = signal(true);
  readonly enviando = signal(false);
  readonly formularioAbierto = signal<number | null>(null);
  readonly errorCarga = signal('');
  readonly errorEnvio = signal('');

  url = '';
  observaciones = '';
  archivo: File | undefined;

  ngOnInit(): void {
    this.api.seguimientos().subscribe({
      next: (respuesta) => {
        this.reportes.set(respuesta.results);
        this.cargando.set(false);
      },
      error: () => {
        this.errorCarga.set('No pudimos cargar los reportes. Inténtalo nuevamente.');
        this.cargando.set(false);
      },
    });
  }

  alternarFormulario(id: number): void {
    this.formularioAbierto.set(this.formularioAbierto() === id ? null : id);
    this.url = '';
    this.observaciones = '';
    this.archivo = undefined;
    this.errorEnvio.set('');
  }

  seleccionarArchivo(event: Event): void {
    this.archivo = (event.target as HTMLInputElement).files?.[0];
  }

  enviarEvidencia(reporte: Seguimiento): void {
    if (!this.archivo && !this.url.trim()) {
      this.errorEnvio.set('Adjunta un archivo o pega un enlace para enviar el reporte.');
      return;
    }

    this.enviando.set(true);
    this.errorEnvio.set('');
    this.api
      .enviarEvidencia(reporte.id, {
        archivo: this.archivo,
        url: this.url.trim(),
        observaciones: this.observaciones.trim(),
      })
      .subscribe({
        next: (actualizado) => {
          this.reportes.update((items) =>
            items.map((item) => (item.id === actualizado.id ? actualizado : item)),
          );
          this.formularioAbierto.set(null);
          this.enviando.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.errorEnvio.set(
            error.status === 0
              ? 'No se pudo conectar con el servidor. Inténtalo nuevamente.'
              : 'No pudimos enviar la evidencia. Revisa el archivo o enlace e inténtalo nuevamente.',
          );
          this.enviando.set(false);
        },
      });
  }

  formatearFecha(fecha: string): string {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(fecha));
  }

  claseEstado(reporte: Seguimiento): string {
    if (reporte.estado === 'Aprobado') return 'approved';
    if (reporte.estado === 'En Revisión') return 'review';
    if (reporte.estado === 'Vencido' || reporte.semaforo === 'rojo') return 'overdue';
    return 'pending';
  }
}
