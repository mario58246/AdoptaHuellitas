import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface HistoriaMuestra {
  nombre: string;
  mascota: string;
  cita: string;
  relato: string;
  imagen: string;
  etiqueta: string;
  estilo: string;
}

@Component({
  selector: 'app-historias',
  imports: [RouterLink],
  templateUrl: './historias.component.html',
  styleUrl: './historias.component.css',
})
export class HistoriasComponent {
  readonly historias: HistoriaMuestra[] = [
    {
      nombre: 'Bruno',
      mascota: 'Perro · nuevo comienzo',
      cita: '“Llegó para quedarse en todos nuestros planes.”',
      relato: 'La primera caminata, la primera siesta al sol y un montón de momentos que recién empiezan.',
      imagen: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1100&q=85',
      etiqueta: 'EN FAMILIA',
      estilo: 'story-green',
    },
    {
      nombre: 'Mora',
      mascota: 'Gata · compañera curiosa',
      cita: '“Eligió su rincón favorito el primer día.”',
      relato: 'Con paciencia y un poco de juego, la casa se llenó de ronroneos y compañía.',
      imagen: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1100&q=85',
      etiqueta: 'NUEVO COMIENZO',
      estilo: 'story-gold',
    },
    {
      nombre: 'Toby',
      mascota: 'Perro · paseos compartidos',
      cita: '“Ahora cada paseo tiene un compañero fiel.”',
      relato: 'Su familia le dio tiempo para adaptarse y hoy disfruta descubrir el barrio a su propio ritmo.',
      imagen: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1100&q=85',
      etiqueta: 'EN FAMILIA',
      estilo: 'story-blue',
    },
  ];
}
