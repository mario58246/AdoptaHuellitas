import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { Mascota } from '../../../core/models/api.models';
import { ApiService } from '../../../core/services/api.service';
import { MascotasPublicasService } from './mascotas-publicas.service';

describe('MascotasPublicasService', () => {
  it('only exposes dogs and cats in the public catalog', async () => {
    const mascotas: Mascota[] = [
      crearMascota(1, 'Perro'),
      crearMascota(2, 'Gato'),
      crearMascota(3, 'Otro'),
    ];

    TestBed.configureTestingModule({
      providers: [
        MascotasPublicasService,
        {
          provide: ApiService,
          useValue: { mascotas: () => of({ count: mascotas.length, results: mascotas }) },
        },
      ],
    });

    const resultado = await firstValueFrom(TestBed.inject(MascotasPublicasService).disponibles());

    expect(resultado.map((mascota) => mascota.especie)).toEqual(['Perro', 'Gato']);
  });
});

function crearMascota(id: number, especie: Mascota['especie']): Mascota {
  return {
    id,
    nombre: `Mascota ${id}`,
    especie,
    edad_aproximada_meses: 12,
    tamaño: 'Mediano',
    sexo: '',
    nivel_actividad: '',
    estado_adopcion: 'Disponible',
    codigo_chip: `99999999999990${id}`,
    fecha_ingreso: '2026-01-01',
    historia: '',
    imagen: null,
    imagen_url: '',
    imagen_display: null,
    archivada: false,
    fecha_baja: null,
    historial_count: 0,
    seguimientos_count: 0,
    creado_en: '2026-01-01T00:00:00Z',
    actualizado_en: '2026-01-01T00:00:00Z',
  };
}
