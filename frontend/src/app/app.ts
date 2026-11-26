import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Mascota } from './core/models/api.models';
import { ApiService } from './core/services/api.service';

type Species = 'Perro' | 'Gato' | 'Otro';
type SpeciesFilter = 'Todos' | Species;

interface PetProfile {
  id?: number;
  name: string;
  age: string;
  species: Species;
  size: string;
  description: string;
  image: string;
  fallback: string;
  imageAlt: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class App implements OnInit {
  private readonly api = inject(ApiService);

  readonly menuOpen = signal(false);
  readonly searchTerm = signal('');
  readonly speciesFilter = signal<SpeciesFilter>('Todos');
  readonly favorites = signal<string[]>([]);
  readonly openFaq = signal<number | null>(0);
  readonly totalMascotas = signal(0);
  readonly maxFichas = 6;

  readonly pets = signal<PetProfile[]>([
    {
      name: 'Bruno',
      age: '2 años',
      species: 'Perro',
      size: 'Mediano',
      description: 'Un compañero alegre que disfruta los paseos y las buenas siestas.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85',
      fallback: 'assets/mascotas/mascota-generica-1.png',
      imageAlt: 'Perro color miel sentado en un jardín'
    },
    {
      name: 'Mora',
      age: '1 año',
      species: 'Gato',
      size: 'Pequeña',
      description: 'Curiosa, dulce y experta en encontrar el rincón más soleado de la casa.',
      image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85',
      fallback: 'assets/mascotas/gato-generico.png',
      imageAlt: 'Gata atigrada mirando a cámara'
    },
    {
      name: 'Lola',
      age: '3 años',
      species: 'Perro',
      size: 'Mediana',
      description: 'Serena y compañera, espera una familia para compartir sus caminatas.',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85',
      fallback: 'assets/mascotas/mascota-generica-1.png',
      imageAlt: 'Perro mestizo de orejas caídas en el parque'
    }
  ]);

  readonly filteredPets = computed(() => {
    const query = this.searchTerm().trim().toLocaleLowerCase('es');
    const species = this.speciesFilter();

    return this.pets().filter((pet) => {
      const matchesName = pet.name.toLocaleLowerCase('es').includes(query);
      const matchesSpecies = species === 'Todos' || pet.species === species;
      return matchesName && matchesSpecies;
    });
  });

  readonly faqs = [
    {
      question: '¿Qué necesito para adoptar?',
      answer: 'Tener ganas de sumar un integrante a la familia, contar con un entorno seguro y comprometerte con sus cuidados. Conversamos con cada persona para conocer su situación y acompañar el proceso.'
    },
    {
      question: '¿Puedo conocer a la mascota antes?',
      answer: 'Sí. Coordinamos un encuentro para que puedan conocerse con tiempo y en un espacio tranquilo. Si hay otros animales en casa, también orientamos cómo hacer una presentación cuidada.'
    },
    {
      question: '¿La adopción tiene algún costo?',
      answer: 'No cobramos por adoptar. Cada animal se entrega con la información disponible sobre su salud y con orientación para continuar sus cuidados veterinarios.'
    },
    {
      question: '¿Qué pasa después de la adopción?',
      answer: 'Seguimos en contacto durante los primeros dos años. Podés consultarnos sobre adaptación y cuidados, y nos alegra recibir novedades de cómo va su nueva vida.'
    }
  ];

  ngOnInit(): void {
    this.api.mascotas({ estado_adopcion: 'Disponible' }).subscribe({
      next: (respuesta) => {
        this.totalMascotas.set(respuesta.results.length);
        this.pets.set(
          respuesta.results.slice(0, this.maxFichas).map((m) => this.mapearMascota(m)),
        );
      },
      error: () => {
        // Sin backend se conservan los perfiles de ejemplo para no romper la landing.
      },
    });
  }

  private mapearMascota(m: Mascota): PetProfile {
    const meses = m.edad_aproximada_meses ?? 0;
    const generica = this.imagenGenerica(m.especie);
    const anios = Math.floor(meses / 12);
    const resto = meses % 12;
    const edad = anios
      ? `${anios} ${anios === 1 ? 'año' : 'años'}${resto ? ` ${resto} mes(es)` : ''}`
      : `${resto} mes(es)`;

    return {
      id: m.id,
      name: m.nombre,
      age: edad,
      species: m.especie,
      size: m.tamaño,
      description: m.historia || 'Conocé más sobre este compañero escribiéndonos.',
      image: m.imagen_display || generica,
      fallback: generica,
      imageAlt: `${m.nombre}, ${m.especie.toLowerCase()} en adopción`,
    };
  }

  private imagenGenerica(especie: Species): string {
    const imagenes: Record<Species, string> = {
      Perro: 'assets/mascotas/mascota-generica-1.png',
      Gato: 'assets/mascotas/gato-generico.png',
      Otro: 'assets/mascotas/mascota-generica-2.png',
    };
    return imagenes[especie] ?? imagenes.Otro;
  }

  usarFallback(pet: PetProfile): void {
    if (pet.image === pet.fallback) return;
    this.pets.update((lista) =>
      lista.map((item) => (item === pet ? { ...item, image: item.fallback } : item)),
    );
  }

  toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  setSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  setSpecies(species: SpeciesFilter): void {
    this.speciesFilter.set(species);
  }

  toggleFavorite(name: string): void {
    this.favorites.update((current) => current.includes(name)
      ? current.filter((favorite) => favorite !== name)
      : [...current, name]);
  }

  toggleFaq(index: number): void {
    this.openFaq.update((current) => current === index ? null : index);
  }
}
