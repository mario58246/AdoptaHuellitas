import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoAdopcion, Mascota } from '../../../../core/models/api.models';
import { ApiService } from '../../../../core/services/api.service';
import { adminStyles } from '../../admin.styles';

@Component({
  selector: 'app-bajas-admin',
  imports: [DatePipe, RouterLink],
  template: `
    <div class="adm-page-head">
      <div>
        <h1 class="adm-title">Mascotas · Bajas</h1>
        <p class="adm-subtitle">
          Animales con estado <strong>Fallecido</strong>. Solo se puede cambiar su estado;
          nombre, microchip y demás datos quedan intactos.
        </p>
      </div>
      <a class="adm-btn ghost" routerLink="/admin/mascotas">← Volver a mascotas</a>
    </div>

    <div class="adm-aviso">
      Su historial médico y seguimiento se conservan, pero dejan de mostrarse en las demás
      secciones. A los 5 años de la baja se eliminan automáticamente junto con todo su historial.
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
                <select class="adm-select" [disabled]="cambiandoId === m.id"
                  [value]="m.estado_adopcion" (change)="cambiarEstado(m, $any($event.target).value)">
                  <option value="Disponible">Disponible</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Adoptado">Adoptado</option>
                </select>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="adm-vacio">No hay mascotas dadas de baja.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [adminStyles],
})
export class BajasAdminComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  mascotas: Mascota[] = [];
  error = '';
  mensaje = '';
  cambiandoId: number | null = null;

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

  cambiarEstado(m: Mascota, estado: string): void {
    if (!estado || estado === 'Fallecido') {
      return;
    }
    if (!confirm(`¿Cambiar el estado de ${m.nombre} a «${estado}»?`)) {
      this.cargar();
      return;
    }

    this.cambiandoId = m.id;
    this.error = '';
    this.api
      .cambiarEstadoMascota(m.id, { estado_adopcion: estado as EstadoAdopcion })
      .subscribe({
        next: () => {
          this.cambiandoId = null;
          this.mensaje = `${m.nombre} volvió a la sección de mascotas activas.`;
          this.cargar();
          this.cdr.markForCheck();
        },
        error: (fallo) => {
          this.cambiandoId = null;
          this.error =
            fallo?.error?.non_field_errors?.[0] ??
            'No se pudo cambiar el estado.';
          this.cargar();
          this.cdr.markForCheck();
        },
      });
  }
}
