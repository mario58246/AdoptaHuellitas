import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  BajaInput,
  HistorialMedicoItem,
  Mascota,
  MascotaInput,
  ResumenApi,
  Seguimiento,
  Solicitud,
} from '../models/api.models';

/** Cambiar esta URL por la de Render cuando se despliegue el backend. */
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

export type FiltrosMascota = {
  especie?: string;
  estado_adopcion?: string;
  search?: string;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  /** DRF devuelve una lista sin paginar; si luego se activa paginación, también funciona. */
  private normalizar<T>(respuesta: T[] | ResumenApi<T>): ResumenApi<T> {
    return Array.isArray(respuesta)
      ? { count: respuesta.length, results: respuesta }
      : respuesta;
  }

  mascotas(filtros: FiltrosMascota = {}): Observable<ResumenApi<Mascota>> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([clave, valor]) => {
      if (valor) {
        params = params.set(clave, valor);
      }
    });
    return this.http
      .get<Mascota[] | ResumenApi<Mascota>>(`${API_BASE_URL}/mascotas/`, { params })
      .pipe(map((respuesta) => this.normalizar(respuesta)));
  }

  mascota(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${API_BASE_URL}/mascotas/${id}/`);
  }

  crearMascota(datos: MascotaInput, imagen?: File | null): Observable<Mascota> {
    return this.http.post<Mascota>(
      `${API_BASE_URL}/mascotas/`,
      this.formDataMascota(datos, imagen),
    );
  }

  editarMascota(id: number, datos: MascotaInput, imagen?: File | null): Observable<Mascota> {
    return this.http.patch<Mascota>(
      `${API_BASE_URL}/mascotas/${id}/`,
      this.formDataMascota(datos, imagen),
    );
  }

  /** DRF acepta el archivo `imagen` cuando la petición va como multipart/form-data. */
  private formDataMascota(datos: MascotaInput, imagen?: File | null): FormData {
    const cuerpo = new FormData();
    Object.entries(datos).forEach(([clave, valor]) => {
      if (valor !== undefined && valor !== null) {
        cuerpo.append(clave, String(valor));
      }
    });
    if (imagen) {
      cuerpo.append('imagen', imagen, imagen.name);
    }
    return cuerpo;
  }

  /** Mascotas dadas de baja; solo disponible para el refugio. */
  bajas(): Observable<ResumenApi<Mascota>> {
    return this.http
      .get<Mascota[] | ResumenApi<Mascota>>(`${API_BASE_URL}/mascotas/bajas/`)
      .pipe(map((respuesta) => this.normalizar(respuesta)));
  }

  /** Cambia únicamente el estado; se usa para dar de baja o reactivar. */
  cambiarEstadoMascota(id: number, estado: BajaInput): Observable<Mascota> {
    return this.http.patch<Mascota>(`${API_BASE_URL}/mascotas/${id}/`, estado);
  }

  solicitudes(): Observable<ResumenApi<Solicitud>> {
    return this.http
      .get<Solicitud[] | ResumenApi<Solicitud>>(`${API_BASE_URL}/solicitudes/`)
      .pipe(map((respuesta) => this.normalizar(respuesta)));
  }

  aprobarSolicitud(id: number, observaciones = ''): Observable<Solicitud> {
    return this.http.post<Solicitud>(`${API_BASE_URL}/solicitudes/${id}/aprobar/`, {
      observaciones,
    });
  }

  rechazarSolicitud(id: number, observaciones = ''): Observable<Solicitud> {
    return this.http.post<Solicitud>(`${API_BASE_URL}/solicitudes/${id}/rechazar/`, {
      observaciones,
    });
  }

  seguimientos(solicitud?: number): Observable<ResumenApi<Seguimiento>> {
    let params = new HttpParams();
    if (solicitud) {
      params = params.set('solicitud', solicitud);
    }
    return this.http
      .get<Seguimiento[] | ResumenApi<Seguimiento>>(`${API_BASE_URL}/seguimientos/`, {
        params,
      })
      .pipe(map((respuesta) => this.normalizar(respuesta)));
  }

  aprobarReporte(id: number, retroalimentacion = ''): Observable<Seguimiento> {
    return this.http.post<Seguimiento>(`${API_BASE_URL}/seguimientos/${id}/aprobar/`, {
      retroalimentacion,
    });
  }

  solicitarCorreccion(id: number, retroalimentacion: string): Observable<Seguimiento> {
    return this.http.post<Seguimiento>(
      `${API_BASE_URL}/seguimientos/${id}/solicitar-correccion/`,
      { retroalimentacion },
    );
  }

  historialMedico(mascota?: number): Observable<ResumenApi<HistorialMedicoItem>> {
    let params = new HttpParams();
    if (mascota) {
      params = params.set('mascota', mascota);
    }
    return this.http
      .get<HistorialMedicoItem[] | ResumenApi<HistorialMedicoItem>>(
        `${API_BASE_URL}/historial-medico/`,
        { params },
      )
      .pipe(map((respuesta) => this.normalizar(respuesta)));
  }

  registrarHistorial(
    datos: Omit<HistorialMedicoItem, 'id'>,
  ): Observable<HistorialMedicoItem> {
    return this.http.post<HistorialMedicoItem>(
      `${API_BASE_URL}/historial-medico/`,
      datos,
    );
  }
}
