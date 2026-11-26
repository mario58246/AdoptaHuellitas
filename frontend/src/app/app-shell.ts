import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Raíz de la aplicación: las páginas públicas y el panel se cargan desde el router.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppShell {}
