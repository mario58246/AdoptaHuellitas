import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Solicitud } from '../../../../core/models/api.models';
import { ApiService } from '../../../../core/services/api.service';
import { adminConfirmStyles, adminStyles } from '../../admin.styles';

@Component({
  selector: 'app-solicitudes-admin',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="adm-page-head">
      <div>
        <h1 class="adm-title">Solicitudes de adopción</h1>
        <p class="adm-subtitle">Revisa cada postulación. Al aprobar se genera el plan de 15 reportes.</p>
      </div>
      <select class="adm-select" style="max-width:200px" [(ngModel)]="filtro" (ngModelChange)="filtrar()">
        <option value="">Todas</option>
        <option value="Pendiente">Pendientes</option>
        <option value="En Revisión">En revisión</option>
        <option value="Aprobada">Aprobadas</option>
        <option value="Rechazada">Rechazadas</option>
      </select>
    </div>

    @if (error) { <div class="adm-error">{{ error }}</div> }
    @if (mensaje) { <div class="adm-aviso">{{ mensaje }}</div> }

    <div class="adm-table-wrap">
      <table class="adm-table">
        <thead>
          <tr><th>Adoptante</th><th>Mascota</th><th>Contacto</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          @for (s of visibles; track s.id) {
            <tr>
              <td><strong>{{ s.nombre_adoptante }}</strong></td>
              <td>{{ s.mascota_nombre }}</td>
              <td>{{ s.correo_contacto }}<br /><span style="color:#667975">{{ s.telefono }}</span></td>
              <td><span class="adm-badge" [class]="color(s.estado_solicitud)">{{ s.estado_solicitud }}</span></td>
              <td>{{ s.fecha_solicitud | date:'dd/MM/yy HH:mm' }}</td>
              <td>
                <div class="adm-acciones">
                  <button class="adm-btn ghost small" type="button" (click)="seleccionada = seleccionada === s.id ? null : s.id">
                    Detalle
                  </button>
                  @if (s.estado_solicitud === 'Pendiente' || s.estado_solicitud === 'En Revisión') {
                    <button class="adm-btn primary small" type="button" (click)="resolver(s, true)">Aprobar</button>
                    <button class="adm-btn danger small" type="button" (click)="resolver(s, false)">Rechazar</button>
                  }
                </div>
              </td>
            </tr>
            @if (seleccionada === s.id) {
              <tr>
                <td colspan="6" style="background:#FAFCFB">
                  <div class="adm-form" style="grid-template-columns:repeat(3,minmax(0,1fr))">
                    <div><strong style="font-size:11px; color:#667975">DIRECCIÓN</strong><p style="font-size:12px; margin:4px 0">{{ s.direccion_residencia }}</p></div>
                    <div><strong style="font-size:11px; color:#667975">HOGAR</strong><p style="font-size:12px; margin:4px 0">{{ s.caracteristicas_hogar || '—' }}</p></div>
                    <div><strong style="font-size:11px; color:#667975">OTRAS MASCOTAS</strong><p style="font-size:12px; margin:4px 0">{{ s.convivencia_otras_mascotas || '—' }}</p></div>
                    <div class="completo"><strong style="font-size:11px; color:#667975">MOTIVO</strong><p style="font-size:12px; margin:4px 0">{{ s.motivo_adopcion || '—' }}</p></div>
                    @if (s.observaciones_admin) {
                      <div class="completo"><strong style="font-size:11px; color:#667975">OBSERVACIONES DEL REFUGIO</strong><p style="font-size:12px; margin:4px 0">{{ s.observaciones_admin }}</p></div>
                    }
                  </div>
                </td>
              </tr>
            }
          } @empty {
            <tr><td colspan="6" class="adm-vacio">No hay solicitudes para este filtro.</td></tr>
          }
        </tbody>
      </table>
    </div>

    @if (pendiente) {
      <div class="adm-overlay" (click)="cerrarModal()">
        <div class="adm-modal adm-confirm" role="dialog" aria-modal="true"
          (click)="$event.stopPropagation()">
          <div class="adm-confirm-icon" [class]="pendiente.aprobar ? 'verde' : 'rojo'" aria-hidden="true">
            {{ pendiente.aprobar ? '✓' : '!' }}
          </div>
          <h3>{{ pendiente.aprobar ? 'Aprobar adopción' : 'Rechazar solicitud' }}</h3>
          <p>
            @if (pendiente.aprobar) {
              Se crearán los 15 reportes de seguimiento para {{ pendiente.solicitud.mascota_nombre }}.
            } @else {
              La solicitud de {{ pendiente.solicitud.nombre_adoptante }} quedará marcada como rechazada.
            }
          </p>
          <div class="adm-modal-foot">
            <button class="adm-btn ghost" type="button" (click)="cerrarModal()">Cancelar</button>
            <button class="adm-btn" [class.primary]="pendiente.aprobar" [class.danger]="!pendiente.aprobar"
              type="button" (click)="confirmarResolucion()">
              {{ pendiente.aprobar ? 'Aprobar' : 'Rechazar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [adminStyles, adminConfirmStyles],
})
export class SolicitudesAdminComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  solicitudes: Solicitud[] = [];
  visibles: Solicitud[] = [];
  filtro = '';
  seleccionada: number | null = null;
  pendiente: { solicitud: Solicitud; aprobar: boolean } | null = null;
  error = '';
  mensaje = '';

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.api.solicitudes().subscribe({
      next: (respuesta) => {
        this.solicitudes = respuesta.results;
        this.filtrar();
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudieron cargar las solicitudes. Verifica el backend.';
        this.cdr.markForCheck();
      },
    });
  }

  filtrar(): void {
    this.visibles = this.filtro
      ? this.solicitudes.filter((s) => s.estado_solicitud === this.filtro)
      : this.solicitudes;
  }

  resolver(s: Solicitud, aprobar: boolean): void {
    this.pendiente = { solicitud: s, aprobar };
    this.error = '';
    this.cdr.markForCheck();
  }

  cerrarModal(): void {
    this.pendiente = null;
    this.cdr.markForCheck();
  }

  confirmarResolucion(): void {
    const pendiente = this.pendiente;
    this.pendiente = null;
    if (!pendiente) {
      return;
    }

    const peticion = pendiente.aprobar
      ? this.api.aprobarSolicitud(pendiente.solicitud.id)
      : this.api.rechazarSolicitud(pendiente.solicitud.id);

    peticion.subscribe({
      next: () => {
        this.mensaje = pendiente.aprobar
          ? 'Adopción aprobada. El plan de 15 reportes ya está activo.'
          : 'Solicitud rechazada.';
        this.cargar();
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudo actualizar la solicitud.';
        this.cdr.markForCheck();
      },
    });
  }

  color(estado: string): string {
    const mapa: Record<string, string> = {
      Aprobada: 'verde',
      'En Revisión': 'azul',
      Pendiente: 'amarillo',
      Rechazada: 'rojo',
    };
    return mapa[estado] ?? 'gris';
  }
}
