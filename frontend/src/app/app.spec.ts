import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MascotasPublicasService } from './modules/public/services/mascotas-publicas.service';
import { InicioComponent } from './modules/public/pages/inicio/inicio.component';

describe('InicioComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [
        provideRouter([]),
        {
          provide: MascotasPublicasService,
          useValue: { disponibles: () => of([]) },
        },
      ],
    }).compileComponents();
  });

  it('renders the public home page and its catalog link', async () => {
    const fixture = TestBed.createComponent(InicioComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Un hogar cambia');
    expect(compiled.querySelector('.home-section-heading a')?.textContent).toContain(
      'Ver catálogo completo',
    );
  });
});
