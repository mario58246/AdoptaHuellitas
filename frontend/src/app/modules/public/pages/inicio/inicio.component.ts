import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  MascotaPublica,
  MascotasPublicasService,
} from '../../services/mascotas-publicas.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit {
  private readonly mascotasService = inject(MascotasPublicasService);

  readonly mascotas = signal<MascotaPublica[]>([]);
  readonly destacadas = computed(() => this.mascotas().slice(0, 3));
  readonly cargando = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.mascotasService.disponibles().subscribe({
      next: (mascotas) => {
        this.mascotas.set(mascotas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar el catálogo. Intenta nuevamente en unos minutos.');
        this.cargando.set(false);
      },
    });
  }

  usarImagenAlternativa(mascota: MascotaPublica): void {
    mascota.imagen = mascota.imagenAlternativa;
  }
}
