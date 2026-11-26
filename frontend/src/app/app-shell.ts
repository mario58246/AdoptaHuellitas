import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Raíz de la aplicación. La landing pública sigue siendo `App` y se muestra en
 * la ruta ''; el panel administrativo se carga de forma diferida en /admin.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppShell {}
