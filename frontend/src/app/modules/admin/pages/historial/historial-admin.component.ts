import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HistorialMedicoItem, Mascota } from '../../../../core/models/api.models';
import { ApiService } from '../../../../core/services/api.service';
import { adminStyles } from '../../admin.styles';

@Component({
  selector: 'app-historial-admin',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="adm-page-head">
      <div>
        <h1 class="adm-title">Historial médico</h1>
        <p class="adm-subtitle">Vacunas, desparasitaciones, cirugías y consultas de cada mascota.</p>
      </div>
      <button class="adm-btn primary" type="button" (click)="modal = true">+ Registrar procedimiento</button>
    </div>

    @if (error) { <div class="adm-error">{{ error }}</div> }
    @if (mensaje) { <div class="adm-aviso">{{ mensaje }}</div> }

    <div class="adm-card">
      <div class="adm-field" style="max-width:280px">
        <label for="mascota">Filtrar por mascota</label>
        <select id="mascota" class="adm-select" [(ngModel)]="mascotaId" (ngModelChange)="cargar()">
          <option value="">Todas las mascotas</option>
          @for (m of mascotas; track m.id) {
            <option [value]="m.id">{{ m.nombre }} · {{ m.codigo_chip }}</option>
          }
        </select>
      </div>
    </div>

    <div class="adm-table-wrap">
      <table class="adm-table">
        <thead>
          <tr><th>Mascota</th><th>Procedimiento</th><th>Fecha</th><th>Veterinario</th><th>Descripción</th></tr>
        </thead>
        <tbody>
          @for (item of registros; track item.id) {
            <tr>
              <td><strong>{{ nombreMascota(item.mascota) }}</strong></td>
              <td><span class="adm-badge mint">{{ item.tipo_procedimiento }}</span></td>
              <td>{{ item.fecha_procedimiento | date:'dd/MM/yy' }}</td>
              <td>{{ item.veterinario_responsable }}</td>
              <td>{{ item.descripcion }}</td>
            </tr>
          } @empty {
            <tr><td colspan="5" class="adm-vacio">No hay registros médicos para este filtro.</td></tr>
          }
        </tbody>
      </table>
    </div>

    @if (modal) {
      <div class="adm-overlay" (click)="modal = false">
        <form class="adm-modal" (click)="$event.stopPropagation()" (ngSubmit)="guardar()" #form="ngForm">
          <h3>Nuevo procedimiento médico</h3>
          <div class="adm-form" style="margin-top:18px">
            <div class="adm-field completo">
              <label for="mascotaForm">Mascota *</label>
              <select id="mascotaForm" name="mascotaForm" class="adm-select" [(ngModel)]="nuevo.mascota" required>
                <option [ngValue]="null">Seleccioná una mascota</option>
                @for (m of mascotas; track m.id) {
                  <option [ngValue]="m.id">{{ m.nombre }} · {{ m.codigo_chip }}</option>
                }
              </select>
            </div>
            <div class="adm-field">
              <label for="tipo">Tipo de procedimiento *</label>
              <select id="tipo" name="tipo" class="adm-select" [(ngModel)]="nuevo.tipo_procedimiento" required>
                <option value="Vacuna">Vacuna</option>
                <option value="Desparasitación">Desparasitación</option>
                <option value="Esterilización">Esterilización</option>
                <option value="Consulta">Consulta</option>
                <option value="Cirugía">Cirugía</option>
              </select>
            </div>
            <div class="adm-field">
              <label for="fecha">Fecha *</label>
              <input id="fecha" name="fecha" class="adm-input" type="date" [(ngModel)]="nuevo.fecha_procedimiento" required />
            </div>
            <div class="adm-field completo">
              <label for="vet">Veterinario responsable *</label>
              <input id="vet" name="vet" class="adm-input" [(ngModel)]="nuevo.veterinario_responsable" required />
            </div>
            <div class="adm-field completo">
              <label for="descripcion">Descripción *</label>
              <textarea id="descripcion" name="descripcion" class="adm-textarea" [(ngModel)]="nuevo.descripcion" required></textarea>
            </div>
          </div>
          <div class="adm-modal-foot">
            <button class="adm-btn ghost" type="button" (click)="modal = false">Cancelar</button>
            <button class="adm-btn primary" type="submit" [disabled]="form.invalid">Guardar</button>
          </div>
        </form>
      </div>
    }
  `,
  styles: [adminStyles],
})
export class HistorialAdminComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  mascotas: Mascota[] = [];
  registros: HistorialMedicoItem[] = [];
  mascotaId: number | '' = '';
  modal = false;
  error = '';
  mensaje = '';

  nuevo = {
    mascota: null as number | null,
    tipo_procedimiento: 'Vacuna',
    fecha_procedimiento: new Date().toISOString().slice(0, 10),
    veterinario_responsable: '',
    descripcion: '',
  };

  ngOnInit(): void {
    this.api.mascotas().subscribe({
      next: (respuesta) => {
        this.mascotas = respuesta.results;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudieron cargar las mascotas.';
        this.cdr.markForCheck();
      },
    });
    this.cargar();
  }

  cargar(): void {
    this.api.historialMedico(this.mascotaId || undefined).subscribe({
      next: (respuesta) => {
        this.registros = respuesta.results;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudo cargar el historial médico.';
        this.cdr.markForCheck();
      },
    });
  }

  nombreMascota(id: number): string {
    return this.mascotas.find((m) => m.id === id)?.nombre ?? `Mascota #${id}`;
  }

  guardar(): void {
    if (!this.nuevo.mascota) {
      return;
    }
    this.api
      .registrarHistorial({
        mascota: this.nuevo.mascota,
        tipo_procedimiento: this.nuevo.tipo_procedimiento,
        fecha_procedimiento: this.nuevo.fecha_procedimiento,
        veterinario_responsable: this.nuevo.veterinario_responsable,
        descripcion: this.nuevo.descripcion,
      })
      .subscribe({
        next: () => {
          this.modal = false;
          this.mensaje = 'Procedimiento registrado correctamente.';
          this.nuevo = {
            mascota: null,
            tipo_procedimiento: 'Vacuna',
            fecha_procedimiento: new Date().toISOString().slice(0, 10),
            veterinario_responsable: '',
            descripcion: '',
          };
          this.cargar();
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = 'No se pudo registrar el procedimiento.';
          this.cdr.markForCheck();
        },
      });
  }
}
