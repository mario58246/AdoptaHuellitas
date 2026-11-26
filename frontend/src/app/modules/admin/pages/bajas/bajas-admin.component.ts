import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoAdopcion, Mascota } from '../../../../core/models/api.models';
import { ApiService } from '../../../../core/services/api.service';
import { adminConfirmStyles, adminStyles } from '../../admin.styles';

@Component({
  selector: 'app-bajas-admin',
  imports: [DatePipe, RouterLink],
  template: `
    <div class="adm-page-head">
      <div>
        <h1 class="adm-title">Mascotas · Bajas</h1>
        <p class="adm-subtitle">Animales con estado <strong>Fallecido</strong>.</p>
      </div>
      <a class="adm-btn ghost" routerLink="/admin/mascotas">← Volver a mascotas</a>
    </div>

    <div class="adm-aviso">
      A los 5 años en estado Fallecido se eliminan todos los datos relacionados con el animal.
    </div>

    @if (error) { <div class="adm-error">{{ error }}</div> }
    @if (mensaje) { <div class="adm-aviso">{{ mensaje }}</div> }

    <div class="adm-table-wrap">
      <table class="adm-table">
        <thead>
          <tr>
            <th>Nombre</th><th>Microchip</th><th>Especie</th>
            <th>Fecha de baja</th><th>Historial</th><th>Reportes</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>
          @for (m of mascotas; track m.id) {
            <tr>
              <td><strong>{{ m.nombre }}</strong></td>
              <td><code>{{ m.codigo_chip }}</code></td>
              <td>{{ m.especie }}</td>
              <td>{{ m.fecha_baja | date:'dd/MM/yyyy' }}</td>
              <td>{{ m.historial_count }} registro(s)</td>
              <td>{{ m.seguimientos_count }} reporte(s)</td>
              <td>
                <div class="adm-acciones">
                  <span class="adm-badge rojo">Fallecido</span>
                  <button class="adm-btn primary small" type="button" [disabled]="cambiandoId === m.id"
                    (click)="pedirReestablecer(m)">Reestablecer</button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="adm-vacio">No hay mascotas dadas de baja.</td></tr>
          }
        </tbody>
      </table>
    </div>

    @if (pendiente) {
      <div class="adm-overlay" (click)="cerrarConfirmacion()">
        <div class="adm-modal adm-confirm" role="dialog" aria-modal="true"
          (click)="$event.stopPropagation()">
          <div class="adm-confirm-icon" aria-hidden="true">↺</div>
          <h3>Reestablecer a {{ pendiente.nombre }}</h3>
          <p>Volverá a Mascotas con estado <strong>Disponible</strong>. Su historial y reportes se conservan.</p>
          <div class="adm-modal-foot">
            <button class="adm-btn ghost" type="button" (click)="cerrarConfirmacion()">Cancelar</button>
            <button class="adm-btn primary" type="button" (click)="confirmarReestablecer()">
              Reestablecer
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [adminStyles, adminConfirmStyles],
})
export class BajasAdminComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  mascotas: Mascota[] = [];
  error = '';
  mensaje = '';
  cambiandoId: number | null = null;
  pendiente: Mascota | null = null;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.api.bajas().subscribe({
      next: (respuesta) => {
        this.mascotas = respuesta.results;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudieron cargar las bajas. Revisá el backend.';
        this.cdr.markForCheck();
      },
    });
  }

  pedirReestablecer(m: Mascota): void {
    this.pendiente = m;
    this.cdr.markForCheck();
  }

  cerrarConfirmacion(): void {
    this.pendiente = null;
    this.cdr.markForCheck();
  }

  confirmarReestablecer(): void {
    const mascota = this.pendiente;
    this.pendiente = null;
    if (mascota) {
      this.ejecutarCambio(mascota);
    }
  }

  private ejecutarCambio(m: Mascota): void {
    this.cambiandoId = m.id;
    this.error = '';
    this.api
      .cambiarEstadoMascota(m.id, { estado_adopcion: 'Disponible' as EstadoAdopcion })
      .subscribe({
        next: () => {
          this.cambiandoId = null;
          this.mensaje = `${m.nombre} volvió a Mascotas como Disponible.`;
          this.cargar();
          this.cdr.markForCheck();
        },
        error: (fallo) => {
          this.cambiandoId = null;
          this.error =
            fallo?.error?.non_field_errors?.[0] ??
            'No se pudo reestablecer la mascota.';
          this.cargar();
          this.cdr.markForCheck();
        },
      });
  }
}
