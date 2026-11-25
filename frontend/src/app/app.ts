import { Component, computed, signal } from '@angular/core';

type Species = 'Perro' | 'Gato';
type SpeciesFilter = 'Todos' | Species;

interface PetProfile {
  name: string;
  age: string;
  species: Species;
  size: string;
  description: string;
  image: string;
  imageAlt: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './home.html',
})
export class App {
  readonly menuOpen = signal(false);
  readonly searchTerm = signal('');
  readonly speciesFilter = signal<SpeciesFilter>('Todos');
  readonly favorites = signal<string[]>([]);
  readonly openFaq = signal<number | null>(0);

  readonly pets: PetProfile[] = [
    {
      name: 'Bruno',
      age: '2 años',
      species: 'Perro',
      size: 'Mediano',
      description: 'Un compañero alegre que disfruta los paseos y las buenas siestas.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85',
      imageAlt: 'Perro color miel sentado en un jardín'
    },
    {
      name: 'Mora',
      age: '1 año',
      species: 'Gato',
      size: 'Pequeña',
      description: 'Curiosa, dulce y experta en encontrar el rincón más soleado de la casa.',
      image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85',
      imageAlt: 'Gata atigrada mirando a cámara'
    },
    {
      name: 'Lola',
      age: '3 años',
      species: 'Perro',
      size: 'Mediana',
      description: 'Serena y compañera, espera una familia para compartir sus caminatas.',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85',
      imageAlt: 'Perro mestizo de orejas caídas en el parque'
    }
  ];

  readonly filteredPets = computed(() => {
    const query = this.searchTerm().trim().toLocaleLowerCase('es');
    const species = this.speciesFilter();

    return this.pets.filter((pet) => {
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
