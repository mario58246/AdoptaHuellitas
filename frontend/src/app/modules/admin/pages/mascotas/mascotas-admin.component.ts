import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Especie,
  EstadoAdopcion,
  Mascota,
  MascotaInput,
  Tamano,
} from '../../../../core/models/api.models';
import { ApiService } from '../../../../core/services/api.service';
import { adminStyles } from '../../admin.styles';

interface FormularioMascota {
  nombre: string;
  especie: Especie;
  edad_aproximada_meses: number | null;
  tamano: Tamano;
  sexo: string;
  nivel_actividad: string;
  estado_adopcion: EstadoAdopcion;
  codigo_chip: string;
  fecha_ingreso: string;
  historia: string;
  imagen_url: string;
  archivada: boolean;
}

@Component({
  selector: 'app-mascotas-admin',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="adm-page-head">
      <div>
        <h1 class="adm-title">Mascotas rescatadas</h1>
        <p class="adm-subtitle">Alta, edición y estado de cada animal del refugio.</p>
      </div>
      <button class="adm-btn primary" type="button" (click)="abrirNuevo()">+ Nueva mascota</button>
    </div>

    @if (error) { <div class="adm-error">{{ error }}</div> }
    @if (mensaje) { <div class="adm-aviso">{{ mensaje }}</div> }

    <div class="adm-card">
      <div class="adm-toolbar">
        <input class="adm-input" type="search" placeholder="Buscar por nombre o chip…"
          [(ngModel)]="busqueda" (ngModelChange)="filtrar()" />
        <select class="adm-select" style="max-width:160px" [(ngModel)]="filtroEspecie" (ngModelChange)="filtrar()">
          <option value="">Todas las especies</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Otro">Otro</option>
        </select>
        <select class="adm-select" style="max-width:180px" [(ngModel)]="filtroEstado" (ngModelChange)="filtrar()">
          <option value="">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Adoptado">Adoptado</option>
          <option value="Fallecido">Fallecido</option>
        </select>
        <span style="margin-left:auto; font-size:12px; color:#667975">{{ visibles.length }} de {{ mascotas.length }}</span>
      </div>
    </div>

    <div class="adm-table-wrap">
      <table class="adm-table">
        <thead>
          <tr><th>Foto</th><th>Nombre</th><th>Chip</th><th>Especie</th><th>Edad</th><th>Estado</th><th>Ingreso</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          @for (m of visibles; track m.id) {
            <tr>
              <td>
                @if (m.imagen_display) {
                  <img class="adm-thumb" [src]="m.imagen_display" [alt]="m.nombre" />
                } @else {
                  <span class="adm-stat-icon mint">🐾</span>
                }
              </td>
              <td><strong>{{ m.nombre }}</strong>@if (m.archivada) { <span class="adm-badge gris">archivada</span> }</td>
              <td><code>{{ m.codigo_chip }}</code></td>
              <td>{{ m.especie }}</td>
              <td>{{ m.edad_aproximada_meses }} mes(es)</td>
              <td><span class="adm-badge" [class]="colorEstado(m.estado_adopcion)">{{ m.estado_adopcion }}</span></td>
              <td>{{ m.fecha_ingreso | date:'dd/MM/yy' }}</td>
              <td>
                <div class="adm-acciones">
                  <button class="adm-btn ghost small" type="button" (click)="abrirEditar(m)">Editar</button>
                  <button class="adm-btn danger small" type="button" (click)="eliminar(m)">Borrar</button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="8" class="adm-vacio">No hay mascotas que coincidan con los filtros.</td></tr>
          }
        </tbody>
      </table>
    </div>

    @if (modalAbierto) {
      <div class="adm-overlay" (click)="cerrarModal()">
        <form class="adm-modal" (click)="$event.stopPropagation()" (ngSubmit)="guardar()" #form="ngForm">
          <h3>{{ editando ? 'Editar mascota' : 'Nueva mascota' }}</h3>
          <p class="adm-subtitle">El código de microchip es obligatorio y sigue el formato CHIP-XXXX-XXXXX.</p>

          <div class="adm-form" style="margin-top:18px">
            <div class="adm-field">
              <label for="nombre">Nombre *</label>
              <input id="nombre" name="nombre" class="adm-input" [(ngModel)]="formulario.nombre" required />
            </div>
            <div class="adm-field">
              <label for="chip">Código de microchip *</label>
              <input id="chip" name="chip" class="adm-input" placeholder="CHIP-1234-56789"
                [(ngModel)]="formulario.codigo_chip" required />
              @if (formulario.codigo_chip && !chipValido) {
                <span style="color:#C64B52; font-size:11px">Formato inválido. Ejemplo: CHIP-1234-56789</span>
              }
            </div>
            <div class="adm-field">
              <label for="especie">Especie *</label>
              <select id="especie" name="especie" class="adm-select" [(ngModel)]="formulario.especie" required>
                <option value="Perro">Perro</option><option value="Gato">Gato</option><option value="Otro">Otro</option>
              </select>
            </div>
            <div class="adm-field">
              <label for="edad">Edad aproximada (meses) *</label>
              <input id="edad" name="edad" class="adm-input" type="number" min="0"
                [(ngModel)]="formulario.edad_aproximada_meses" required />
            </div>
            <div class="adm-field">
              <label for="tamano">Tamaño *</label>
              <select id="tamano" name="tamano" class="adm-select" [(ngModel)]="formulario.tamano" required>
                <option value="Pequeño">Pequeño</option><option value="Mediano">Mediano</option><option value="Grande">Grande</option>
              </select>
            </div>
            <div class="adm-field">
              <label for="sexo">Sexo</label>
              <select id="sexo" name="sexo" class="adm-select" [(ngModel)]="formulario.sexo">
                <option value="">Sin especificar</option><option value="Macho">Macho</option><option value="Hembra">Hembra</option>
              </select>
            </div>
            <div class="adm-field">
              <label for="actividad">Nivel de actividad</label>
              <select id="actividad" name="actividad" class="adm-select" [(ngModel)]="formulario.nivel_actividad">
                <option value="">Sin especificar</option><option value="Bajo">Bajo</option><option value="Medio">Medio</option><option value="Alto">Alto</option>
              </select>
            </div>
            <div class="adm-field">
              <label for="estado">Estado de adopción</label>
              <select id="estado" name="estado" class="adm-select" [(ngModel)]="formulario.estado_adopcion">
                <option value="Disponible">Disponible</option><option value="En Proceso">En Proceso</option>
                <option value="Adoptado">Adoptado</option><option value="Fallecido">Fallecido</option>
              </select>
            </div>
            <div class="adm-field">
              <label for="ingreso">Fecha de ingreso</label>
              <input id="ingreso" name="ingreso" class="adm-input" type="date" [(ngModel)]="formulario.fecha_ingreso" />
            </div>
            <div class="adm-field completo">
              <label for="url">URL de imagen externa (Drive / Cloudinary)</label>
              <input id="url" name="url" class="adm-input" type="url" placeholder="https://…"
                [(ngModel)]="formulario.imagen_url" />
            </div>
            <div class="adm-field completo">
              <label for="historia">Historia</label>
              <textarea id="historia" name="historia" class="adm-textarea" [(ngModel)]="formulario.historia"></textarea>
            </div>
            <label style="font-size:12px; display:flex; gap:8px; align-items:center">
              <input type="checkbox" name="archivada" [(ngModel)]="formulario.archivada" /> Archivada
            </label>
          </div>

          <div class="adm-modal-foot">
            <button class="adm-btn ghost" type="button" (click)="cerrarModal()">Cancelar</button>
            <button class="adm-btn primary" type="submit" [disabled]="form.invalid || !chipValido || guardando">
              {{ guardando ? 'Guardando…' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    }
  `,
  styles: [adminStyles],
})
export class MascotasAdminComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  mascotas: Mascota[] = [];
  visibles: Mascota[] = [];
  busqueda = '';
  filtroEspecie = '';
  filtroEstado = '';
  error = '';
  mensaje = '';
  modalAbierto = false;
  guardando = false;
  editando: number | null = null;

  formulario: FormularioMascota = this.formularioVacio();

  ngOnInit(): void {
    this.cargar();
  }

  get chipValido(): boolean {
    return /^CHIP-\d{4}-\d{5}$/.test(this.formulario.codigo_chip ?? '');
  }

  cargar(): void {
    this.api.mascotas().subscribe({
      next: (respuesta) => {
        this.mascotas = respuesta.results;
        this.filtrar();
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudieron cargar las mascotas. Revisá el backend.';
        this.cdr.markForCheck();
      },
    });
  }

  filtrar(): void {
    const q = this.busqueda.trim().toLocaleLowerCase('es');
    this.visibles = this.mascotas.filter((m) => {
      const coincideTexto =
        !q ||
        m.nombre.toLocaleLowerCase('es').includes(q) ||
        m.codigo_chip.toLocaleLowerCase('es').includes(q);
      const coincideEspecie = !this.filtroEspecie || m.especie === this.filtroEspecie;
      const coincideEstado = !this.filtroEstado || m.estado_adopcion === this.filtroEstado;
      return coincideTexto && coincideEspecie && coincideEstado;
    });
  }

  abrirNuevo(): void {
    this.editando = null;
    this.formulario = this.formularioVacio();
    this.mensaje = '';
    this.modalAbierto = true;
  }

  abrirEditar(m: Mascota): void {
    this.editando = m.id;
    this.formulario = {
      nombre: m.nombre,
      especie: m.especie,
      edad_aproximada_meses: m.edad_aproximada_meses,
      tamano: m.tamaño,
      sexo: m.sexo || '',
      nivel_actividad: m.nivel_actividad || '',
      estado_adopcion: m.estado_adopcion,
      codigo_chip: m.codigo_chip,
      fecha_ingreso: m.fecha_ingreso || '',
      historia: m.historia || '',
      imagen_url: m.imagen_url || '',
      archivada: m.archivada,
    };
    this.mensaje = '';
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  guardar(): void {
    if (!this.chipValido) {
      return;
    }
    this.guardando = true;
    this.error = '';
    const { tamano, ...resto } = this.formulario;
    const datos: MascotaInput = {
      ...resto,
      tamaño: tamano,
      edad_aproximada_meses: Number(this.formulario.edad_aproximada_meses),
    };
    const peticion = this.editando
      ? this.api.editarMascota(this.editando, datos)
      : this.api.crearMascota(datos);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.modalAbierto = false;
        this.mensaje = this.editando ? 'Mascota actualizada correctamente.' : 'Mascota registrada correctamente.';
        this.cargar();
        this.cdr.markForCheck();
      },
      error: (fallo) => {
        this.guardando = false;
        this.error = this.mensajeError(fallo?.error, 'No se pudo guardar la mascota.');
        this.cdr.markForCheck();
      },
    });
  }

  eliminar(m: Mascota): void {
    if (!confirm(`¿Eliminar a ${m.nombre}? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.api.eliminarMascota(m.id).subscribe({
      next: () => {
        this.mensaje = `${m.nombre} fue eliminada.`;
        this.cargar();
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudo eliminar la mascota.';
        this.cdr.markForCheck();
      },
    });
  }

  colorEstado(estado: string): string {
    const mapa: Record<string, string> = {
      Disponible: 'verde',
      'En Proceso': 'azul',
      Adoptado: 'gris',
      Fallecido: 'rojo',
    };
    return mapa[estado] ?? 'gris';
  }

  private mensajeError(cuerpo: unknown, texto: string): string {
    if (cuerpo && typeof cuerpo === 'object') {
      const partes = Object.values(cuerpo as Record<string, unknown>).flat();
      if (partes.length) {
        return String(partes[0]);
      }
    }
    return texto;
  }

  private formularioVacio(): FormularioMascota {
    return {
      nombre: '',
      especie: 'Perro',
      edad_aproximada_meses: null,
      tamano: 'Mediano',
      sexo: '',
      nivel_actividad: '',
      estado_adopcion: 'Disponible',
      codigo_chip: '',
      fecha_ingreso: new Date().toISOString().slice(0, 10),
      historia: '',
      imagen_url: '',
      archivada: false,
    };
  }
}
