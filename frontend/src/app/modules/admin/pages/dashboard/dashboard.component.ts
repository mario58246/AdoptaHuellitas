import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Mascota, Seguimiento, Solicitud } from '../../../../core/models/api.models';
import { ApiService } from '../../../../core/services/api.service';
import { adminStyles } from '../../admin.styles';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DatePipe, RouterLink],
  template: `
    <div class="adm-page-head">
      <div>
        <h1 class="adm-title">Resumen del refugio</h1>
        <p class="adm-subtitle">Estado general de mascotas, adopciones y seguimiento post-adopción.</p>
      </div>
      <a class="adm-btn primary" routerLink="/admin/mascotas">+ Registrar mascota</a>
    </div>

    @if (error) {
      <div class="adm-error">{{ error }}</div>
    }

    @if (cargando) {
      <div class="adm-card">Cargando datos del refugio…</div>
    } @else {
      <section class="adm-grid" aria-label="Indicadores principales">
        <article class="adm-card">
          <div class="adm-card-head">
            <span class="adm-card-title">Mascotas registradas</span>
            <span class="adm-stat-icon mint">🐾</span>
          </div>
          <div class="adm-stat-value">{{ mascotas.length }}</div>
          <span class="adm-badge verde">{{ disponibles }} disponibles</span>
        </article>

        <article class="adm-card">
          <div class="adm-card-head">
            <span class="adm-card-title">Solicitudes activas</span>
            <span class="adm-stat-icon blue">✉</span>
          </div>
          <div class="adm-stat-value">{{ pendientes }}</div>
          <span class="adm-badge azul">Pendientes de revisión</span>
        </article>

        <article class="adm-card">
          <div class="adm-card-head">
            <span class="adm-card-title">Adopciones aprobadas</span>
            <span class="adm-stat-icon mint">✓</span>
          </div>
          <div class="adm-stat-value">{{ aprobadas }}</div>
          <span class="adm-badge gris">Ciclo con seguimiento</span>
        </article>

        <article class="adm-card">
          <div class="adm-card-head">
            <span class="adm-card-title">Reportes en alerta</span>
            <span class="adm-stat-icon red">!</span>
          </div>
          <div class="adm-stat-value">{{ alertas }}</div>
          <span class="adm-badge rojo">Vencidos o con alerta</span>
        </article>
      </section>

      <section class="adm-two">
        <article class="adm-card">
          <div class="adm-card-head">
            <h2 class="adm-title" style="font-size:16px">Últimas solicitudes</h2>
            <a class="adm-link" routerLink="/admin/solicitudes">Ver todas →</a>
          </div>
          @if (ultimasSolicitudes.length) {
            <div class="adm-table-wrap" style="margin-top:14px">
              <table class="adm-table">
                <thead>
                  <tr><th>Adoptante</th><th>Mascota</th><th>Estado</th><th>Fecha</th></tr>
                </thead>
                <tbody>
                  @for (s of ultimasSolicitudes; track s.id) {
                    <tr>
                      <td>{{ s.nombre_adoptante }}</td>
                      <td>{{ s.mascota_nombre }}</td>
                      <td><span class="adm-badge" [class]="colorSolicitud(s.estado_solicitud)">{{ s.estado_solicitud }}</span></td>
                      <td>{{ s.fecha_solicitud | date:'dd/MM/yy' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <p class="adm-vacio">Todavía no hay solicitudes de adopción.</p>
          }
        </article>

        <article class="adm-card">
          <div class="adm-card-head">
            <h2 class="adm-title" style="font-size:16px">Semáforo de seguimiento</h2>
            <a class="adm-link" routerLink="/admin/seguimiento">Ver matriz →</a>
          </div>
          <div class="adm-grid" style="margin-top:14px; grid-template-columns:repeat(2,minmax(0,1fr))">
            @for (item of semaforo; track item.color) {
              <div style="display:flex; align-items:center; gap:8px">
                <span class="adm-dot" [class]="item.color"></span>
                <span style="font-size:12px; color:#667975">{{ item.etiqueta }}</span>
                <strong style="margin-left:auto">{{ item.total }}</strong>
              </div>
            }
          </div>
          @if (alertasDetalle.length) {
            <div class="adm-aviso" style="margin-top:16px">
              {{ alertasDetalle.length }} reporte(s) requieren atención inmediata.
            </div>
          }
        </article>
      </section>
    }
  `,
  styles: [adminStyles],
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando = true;
  error = '';
  mascotas: Mascota[] = [];
  solicitudes: Solicitud[] = [];
  seguimientos: Seguimiento[] = [];

  ngOnInit(): void {
    forkJoin({
      mascotas: this.api.mascotas(),
      solicitudes: this.api.solicitudes(),
      seguimientos: this.api.seguimientos(),
    }).subscribe({
      next: ({ mascotas, solicitudes, seguimientos }) => {
        this.mascotas = mascotas.results;
        this.solicitudes = solicitudes.results;
        this.seguimientos = seguimientos.results;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudo cargar el resumen. Revisá que el backend esté activo en http://127.0.0.1:8000.';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  get disponibles(): number {
    return this.mascotas.filter((m) => m.estado_adopcion === 'Disponible').length;
  }

  get pendientes(): number {
    return this.solicitudes.filter((s) =>
      ['Pendiente', 'En Revisión'].includes(s.estado_solicitud),
    ).length;
  }

  get aprobadas(): number {
    return this.solicitudes.filter((s) => s.estado_solicitud === 'Aprobada').length;
  }

  get alertas(): number {
    return this.seguimientos.filter((s) => s.semaforo === 'rojo').length;
  }

  get alertasDetalle(): Seguimiento[] {
    return this.seguimientos.filter((s) => s.semaforo === 'rojo');
  }

  get ultimasSolicitudes(): Solicitud[] {
    return this.solicitudes.slice(0, 5);
  }

  get semaforo(): { color: string; etiqueta: string; total: number }[] {
    const datos = [
      { color: 'verde', etiqueta: 'Verde · aprobado' },
      { color: 'azul', etiqueta: 'Azul · en revisión' },
      { color: 'amarillo', etiqueta: 'Amarillo · pendiente' },
      { color: 'rojo', etiqueta: 'Rojo · vencido' },
    ];
    return datos.map((d) => ({
      ...d,
      total: this.seguimientos.filter((s) => s.semaforo === d.color).length,
    }));
  }

  colorSolicitud(estado: string): string {
    const mapa: Record<string, string> = {
      Aprobada: 'verde',
      'En Revisión': 'azul',
      Pendiente: 'amarillo',
      Rechazada: 'rojo',
    };
    return mapa[estado] ?? 'gris';
  }
}
