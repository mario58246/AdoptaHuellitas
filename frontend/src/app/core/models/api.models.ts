export type Especie = 'Perro' | 'Gato' | 'Otro';
export type Tamano = 'Pequeño' | 'Mediano' | 'Grande';
export type EstadoAdopcion = 'Disponible' | 'En Proceso' | 'Adoptado' | 'Fallecido';
export type EstadoSolicitud = 'Pendiente' | 'En Revisión' | 'Aprobada' | 'Rechazada';
export type EstadoReporte = 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Vencido';
export type Semaforo = 'verde' | 'azul' | 'amarillo' | 'rojo';

export interface Mascota {
  id: number;
  nombre: string;
  especie: Especie;
  edad_aproximada_meses: number;
  tamaño: Tamano;
  sexo: string;
  nivel_actividad: string;
  estado_adopcion: EstadoAdopcion;
  codigo_chip: string;
  fecha_ingreso: string;
  historia: string;
  imagen: string | null;
  imagen_url: string;
  imagen_display: string | null;
  archivada: boolean;
  fecha_baja: string | null;
  historial_count: number;
  seguimientos_count: number;
  creado_en: string;
  actualizado_en: string;
}

export type MascotaInput = Pick<
  Mascota,
  'nombre' | 'especie' | 'edad_aproximada_meses' | 'tamaño' | 'codigo_chip'
> &
  Partial<
    Pick<
      Mascota,
      | 'sexo'
      | 'nivel_actividad'
      | 'estado_adopcion'
      | 'fecha_ingreso'
      | 'historia'
      | 'imagen_url'
      | 'archivada'
    >
  >;

/** En Bajas el único campo editable es el estado. */
export type BajaInput = Pick<Mascota, 'estado_adopcion'>;

export interface Solicitud {
  id: number;
  mascota: number;
  mascota_nombre: string;
  adoptante: number | null;
  nombre_adoptante: string;
  correo_contacto: string;
  telefono: string;
  direccion_residencia: string;
  caracteristicas_hogar: string;
  convivencia_otras_mascotas: string;
  motivo_adopcion: string;
  estado_solicitud: EstadoSolicitud;
  fecha_solicitud: string;
  fecha_resolucion: string | null;
  observaciones_admin: string;
}

export type SolicitudInput = Pick<
  Solicitud,
  | 'mascota'
  | 'nombre_adoptante'
  | 'correo_contacto'
  | 'telefono'
  | 'direccion_residencia'
> &
  Partial<
    Pick<
      Solicitud,
      'caracteristicas_hogar' | 'convivencia_otras_mascotas' | 'motivo_adopcion'
    >
  >;

export interface Seguimiento {
  id: number;
  solicitud: number;
  mascota: number;
  mascota_nombre: string;
  numero_reporte: number;
  mes_programado: number;
  fecha_limite: string;
  archivo_evidencia: string | null;
  url_evidencia: string;
  evidencia_display: string | null;
  observaciones_adoptante: string;
  estado: EstadoReporte;
  semaforo: Semaforo;
  fecha_envio: string | null;
  fecha_revision: string | null;
  retroalimentacion: string;
}

export interface HistorialMedicoItem {
  id: number;
  mascota: number;
  tipo_procedimiento: string;
  descripcion: string;
  fecha_procedimiento: string;
  veterinario_responsable: string;
}

export interface ResumenApi<T> {
  count: number;
  results: T[];
}
