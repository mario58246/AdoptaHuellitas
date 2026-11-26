import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Especie, Mascota } from '../../../core/models/api.models';
import { ApiService } from '../../../core/services/api.service';

export interface MascotaPublica {
  id: number;
  nombre: string;
  especie: Especie;
  edad: string;
  tamano: string;
  sexo: string;
  actividad: string;
  historia: string;
  imagen: string;
  imagenAlternativa: string;
}

@Injectable({ providedIn: 'root' })
export class MascotasPublicasService {
  private readonly api = inject(ApiService);

  disponibles(): Observable<MascotaPublica[]> {
    return this.api
      .mascotas({ estado_adopcion: 'Disponible' })
      .pipe(
        map((respuesta) =>
          respuesta.results
            .filter((mascota) => mascota.especie === 'Perro' || mascota.especie === 'Gato')
            .map((mascota) => this.mapear(mascota)),
        ),
      );
  }

  private mapear(mascota: Mascota): MascotaPublica {
    const imagenAlternativa = this.imagenGenerica(mascota.especie);

    return {
      id: mascota.id,
      nombre: mascota.nombre,
      especie: mascota.especie,
      edad: this.formatearEdad(mascota.edad_aproximada_meses),
      tamano: mascota.tamaño,
      sexo: mascota.sexo,
      actividad: mascota.nivel_actividad,
      historia: mascota.historia || 'Conoce más sobre esta mascota escribiéndonos.',
      imagen: mascota.imagen_display || imagenAlternativa,
      imagenAlternativa,
    };
  }

  private formatearEdad(meses: number): string {
    const anios = Math.floor(meses / 12);
    const resto = meses % 12;

    if (anios > 0) {
      return `${anios} ${anios === 1 ? 'año' : 'años'}${resto ? ` y ${resto} meses` : ''}`;
    }

    return `${resto} ${resto === 1 ? 'mes' : 'meses'}`;
  }

  private imagenGenerica(especie: Especie): string {
    const imagenes: Record<Especie, string> = {
      Perro: 'assets/mascotas/mascota-generica-1.png',
      Gato: 'assets/mascotas/gato-generico.png',
      Otro: 'assets/mascotas/mascota-generica-2.png',
    };
    return imagenes[especie];
  }
}
