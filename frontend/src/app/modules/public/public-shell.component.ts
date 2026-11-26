import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './public-shell.component.html',
  styleUrl: './public-shell.component.css',
})
export class PublicShellComponent {
  readonly menuOpen = signal(false);

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
