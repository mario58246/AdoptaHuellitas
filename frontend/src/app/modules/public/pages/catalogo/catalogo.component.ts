import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tamano } from '../../../../core/models/api.models';
import {
  MascotaPublica,
  MascotasPublicasService,
} from '../../services/mascotas-publicas.service';

type FiltroEspecie = 'Todos' | 'Perro' | 'Gato';
type FiltroTamano = 'Todos' | Tamano;

@Component({
  selector: 'app-catalogo',
  imports: [RouterLink],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
})
export class CatalogoComponent implements OnInit {
  private readonly mascotasService = inject(MascotasPublicasService);

  readonly mascotas = signal<MascotaPublica[]>([]);
  readonly busqueda = signal('');
  readonly especieSeleccionada = signal<FiltroEspecie>('Todos');
  readonly tamanoSeleccionado = signal<FiltroTamano>('Todos');
  readonly cargando = signal(true);
  readonly error = signal('');

  readonly mascotasFiltradas = computed(() => {
    const termino = this.busqueda().trim().toLocaleLowerCase('es');
    const especie = this.especieSeleccionada();
    const tamano = this.tamanoSeleccionado();

    return this.mascotas().filter((mascota) => {
      const coincideNombre = mascota.nombre.toLocaleLowerCase('es').includes(termino);
      const coincideEspecie = especie === 'Todos' || mascota.especie === especie;
      const coincideTamano = tamano === 'Todos' || mascota.tamano === tamano;
      return coincideNombre && coincideEspecie && coincideTamano;
    });
  });

  ngOnInit(): void {
    this.mascotasService.disponibles().subscribe({
      next: (mascotas) => {
        this.mascotas.set(mascotas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No pudimos conectar con el catálogo. Vuelve a intentarlo más tarde.');
        this.cargando.set(false);
      },
    });
  }

  cambiarEspecie(especie: FiltroEspecie): void {
    this.especieSeleccionada.set(especie);
  }

  actualizarBusqueda(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  cambiarTamano(event: Event): void {
    const tamano = (event.target as HTMLSelectElement).value;
    if (tamano === 'Todos' || tamano === 'Pequeño' || tamano === 'Mediano' || tamano === 'Grande') {
      this.tamanoSeleccionado.set(tamano);
    }
  }

  contactoUrl(mascota: MascotaPublica): string {
    const asunto = encodeURIComponent(`Quiero conocer a ${mascota.nombre}`);
    return `mailto:ag123angie1@gmail.com?subject=${asunto}`;
  }

  usarImagenAlternativa(mascota: MascotaPublica): void {
    mascota.imagen = mascota.imagenAlternativa;
  }
}
