import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seguimiento } from '../../../../core/models/api.models';
import { ApiService } from '../../../../core/services/api.service';
import { adminConfirmStyles, adminStyles } from '../../admin.styles';

interface Grupo {
  solicitud: number;
  mascota: string;
  reportes: Seguimiento[];
}

@Component({
  selector: 'app-seguimiento-admin',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="adm-page-head">
      <div>
        <h1 class="adm-title">Seguimiento post-adopción</h1>
        <p class="adm-subtitle">Matriz de 15 reportes por adopción (meses 1-12, 16, 20 y 24).</p>
      </div>
      <select class="adm-select" style="max-width:220px" [(ngModel)]="filtro" (ngModelChange)="filtrar()">
        <option value="">Todos los estados</option>
        <option value="verde">Verde · aprobado</option>
        <option value="azul">Azul · en revisión</option>
        <option value="amarillo">Amarillo · pendiente</option>
        <option value="rojo">Rojo · vencido</option>
      </select>
    </div>

    @if (error) { <div class="adm-error">{{ error }}</div> }
    @if (mensaje) { <div class="adm-aviso">{{ mensaje }}</div> }

    <div class="adm-card" style="display:flex; gap:18px; flex-wrap:wrap">
      @for (item of resumen; track item.color) {
        <span style="display:flex; align-items:center; gap:7px; font-size:12px">
          <span class="adm-dot" [class]="item.color"></span>{{ item.etiqueta }} <strong>{{ item.total }}</strong>
        </span>
      }
    </div>

    @for (grupo of grupos; track grupo.solicitud) {
      <article class="adm-card">
        <div class="adm-card-head">
          <h2 class="adm-title" style="font-size:16px">Solicitud #{{ grupo.solicitud }} · {{ grupo.mascota }}</h2>
          <span class="adm-badge gris">{{ grupo.reportes.length }} reportes</span>
        </div>
        <div class="adm-table-wrap" style="margin-top:14px">
          <table class="adm-table">
            <thead>
              <tr><th>#</th><th>Mes</th><th>Límite</th><th>Estado</th><th>Semáforo</th><th>Evidencia</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              @for (r of grupo.reportes; track r.id) {
                <tr>
                  <td><strong>{{ r.numero_reporte }}</strong></td>
                  <td>{{ r.mes_programado }}</td>
                  <td>{{ r.fecha_limite | date:'dd/MM/yy' }}</td>
                  <td>{{ r.estado }}</td>
                  <td><span class="adm-badge" [class]="r.semaforo"><span class="adm-dot" [class]="r.semaforo"></span>{{ r.semaforo }}</span></td>
                  <td>
                    @if (r.evidencia_display) {
                      <a class="adm-link" [href]="r.evidencia_display" target="_blank" rel="noopener">Ver evidencia ↗</a>
                    } @else {
                      <span style="color:#667975">Sin cargar</span>
                    }
                  </td>
                  <td>
                    <div class="adm-acciones">
                      <button class="adm-btn primary small" type="button" [disabled]="r.estado === 'Aprobado'"
                        (click)="revisar(r, true)">Aprobar</button>
                      <button class="adm-btn ghost small" type="button"
                        (click)="revisar(r, false)">Corregir</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </article>
    } @empty {
      <div class="adm-card adm-vacio">No hay reportes de seguimiento todavía. Aprobá una solicitud para generarlos.</div>
    }

    @if (pendiente) {
      <div class="adm-overlay" (click)="cerrarModal()">
        <div class="adm-modal adm-confirm" role="dialog" aria-modal="true"
          (click)="$event.stopPropagation()">
          <div class="adm-confirm-icon" [class]="pendiente.aprobar ? 'verde' : 'azul'" aria-hidden="true">
            {{ pendiente.aprobar ? '✓' : '✎' }}
          </div>
          <h3>{{ pendiente.aprobar ? 'Aprobar reporte' : 'Corregir reporte' }}</h3>
          <p>
            @if (pendiente.aprobar) {
              Retroalimentación para el adoptante sobre el reporte del mes {{ pendiente.reporte.mes_programado }}.
            } @else {
              Indicá qué debe corregir el adoptante en el reporte del mes {{ pendiente.reporte.mes_programado }}.
            }
          </p>
          <div class="adm-field">
            <label for="retroalimentacion">{{ pendiente.aprobar ? 'Mensaje (opcional)' : 'Motivo de la corrección' }}</label>
            <textarea id="retroalimentacion" class="adm-input" [(ngModel)]="retroalimentacion"
              [placeholder]="pendiente.aprobar ? '¡Excelente seguimiento!' : 'Adjuntá la evidencia del mes correspondiente.'"></textarea>
          </div>
          <div class="adm-modal-foot">
            <button class="adm-btn ghost" type="button" (click)="cerrarModal()">Cancelar</button>
            <button class="adm-btn" [class.primary]="pendiente.aprobar" [class.info]="!pendiente.aprobar"
              type="button" (click)="confirmarRevision()">
              {{ pendiente.aprobar ? 'Aprobar' : 'Solicitar corrección' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [adminStyles, adminConfirmStyles],
})
export class SeguimientoAdminComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  reportes: Seguimiento[] = [];
  grupos: Grupo[] = [];
  filtro = '';
  error = '';
  mensaje = '';
  pendiente: { reporte: Seguimiento; aprobar: boolean } | null = null;
  retroalimentacion = '';

  ngOnInit(): void {
    this.cargar();
  }

  get resumen(): { color: string; etiqueta: string; total: number }[] {
    const datos = [
      { color: 'verde', etiqueta: 'Aprobados' },
      { color: 'azul', etiqueta: 'En revisión' },
      { color: 'amarillo', etiqueta: 'Pendientes' },
      { color: 'rojo', etiqueta: 'Vencidos' },
    ];
    return datos.map((d) => ({
      ...d,
      total: this.reportes.filter((r) => r.semaforo === d.color).length,
    }));
  }

  cargar(): void {
    this.api.seguimientos().subscribe({
      next: (respuesta) => {
        this.reportes = respuesta.results;
        this.filtrar();
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudieron cargar los reportes. Revisá el backend.';
        this.cdr.markForCheck();
      },
    });
  }

  filtrar(): void {
    const filtrados = this.filtro
      ? this.reportes.filter((r) => r.semaforo === this.filtro)
      : this.reportes;

    const mapa = new Map<number, Grupo>();
    filtrados.forEach((reporte) => {
      if (!mapa.has(reporte.solicitud)) {
        mapa.set(reporte.solicitud, {
          solicitud: reporte.solicitud,
          mascota: reporte.mascota_nombre,
          reportes: [],
        });
      }
      mapa.get(reporte.solicitud)!.reportes.push(reporte);
    });
    this.grupos = [...mapa.values()];
  }

  revisar(reporte: Seguimiento, aprobar: boolean): void {
    this.pendiente = { reporte, aprobar };
    this.retroalimentacion = aprobar ? '¡Excelente seguimiento!' : '';
    this.error = '';
    this.cdr.markForCheck();
  }

  cerrarModal(): void {
    this.pendiente = null;
    this.cdr.markForCheck();
  }

  confirmarRevision(): void {
    const pendiente = this.pendiente;
    this.pendiente = null;
    if (!pendiente) {
      return;
    }

    const peticion = pendiente.aprobar
      ? this.api.aprobarReporte(pendiente.reporte.id, this.retroalimentacion)
      : this.api.solicitarCorreccion(pendiente.reporte.id, this.retroalimentacion);

    peticion.subscribe({
      next: () => {
        this.mensaje = pendiente.aprobar
          ? 'Reporte aprobado.'
          : 'Corrección solicitada al adoptante.';
        this.cargar();
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudo actualizar el reporte.';
        this.cdr.markForCheck();
      },
    });
  }
}
