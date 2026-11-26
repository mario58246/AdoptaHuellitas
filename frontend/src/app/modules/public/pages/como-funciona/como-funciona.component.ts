import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-como-funciona',
  imports: [RouterLink],
  templateUrl: './como-funciona.component.html',
  styleUrl: './como-funciona.component.css',
})
export class ComoFuncionaComponent {
  readonly pasos = [
    {
      numero: '01',
      titulo: 'Conoce',
      detalle: 'Explora los perfiles y encuentra una mascota cuya energía y necesidades conecten con tu hogar.',
      icono: '⌕',
    },
    {
      numero: '02',
      titulo: 'Conversemos',
      detalle: 'Nos contás sobre tu hogar, tu experiencia y cómo imaginás compartir la vida con un nuevo compañero.',
      icono: '✉',
    },
    {
      numero: '03',
      titulo: 'Prepárense',
      detalle: 'Coordinamos un encuentro y te orientamos para preparar una llegada tranquila y segura.',
      icono: '⌂',
    },
    {
      numero: '04',
      titulo: 'Una vida juntos',
      detalle: 'La adopción comienza en casa. Seguimos cerca para acompañar la adaptación y resolver dudas.',
      icono: '♡',
    },
  ];

  readonly compromisos = [
    'Conocer el carácter y las necesidades de cada mascota.',
    'Asegurar un espacio protegido, tiempo y cuidados veterinarios.',
    'Mantener el contacto con el refugio durante el seguimiento.',
  ];
}
