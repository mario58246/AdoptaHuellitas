import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ingresar',
  imports: [RouterLink],
  template: `
    <main class="ingresar-page">
      <header class="ingresar-topbar">
        <a class="ingresar-brand" routerLink="/" aria-label="Volver al inicio">
          <img src="assets/logo-adopta-huellitas.png" alt="" aria-hidden="true" />
          <span>Adopta <strong>Huellitas</strong></span>
        </a>
        <a class="ingresar-volver" routerLink="/">← Volver al sitio público</a>
      </header>

      <section class="ingresar-hero">
        <p class="ingresar-eyebrow">ACCESO AL REFUGIO</p>
        <h1>¿Cómo quieres ingresar?</h1>
        <p class="ingresar-lead">
          El catálogo, el proceso de adopción y las historias están disponibles sin iniciar sesión.
          Elige el acceso según tu rol.
        </p>

        <div class="ingresar-opciones">
          <article class="ingresar-card">
            <span class="ingresar-icono" aria-hidden="true">🐾</span>
            <h2>Soy adoptante</h2>
            <p>El portal para enviar solicitudes y seguir una adopción estará disponible próximamente.</p>
            <div class="ingresar-acciones">
              <button type="button" class="ingresar-btn" disabled>Ingresar</button>
              <button type="button" class="ingresar-btn outline" disabled>Crear cuenta</button>
            </div>
            <p class="ingresar-nota">
              El portal del adoptante lo está terminando Mario. Ya estará disponible aquí.
            </p>
          </article>

          <article class="ingresar-card admin">
            <span class="ingresar-icono" aria-hidden="true">🛡️</span>
            <h2>Soy administrador</h2>
            <p>Accede al panel del refugio para gestionar mascotas, solicitudes, bajas y seguimiento.</p>
            <div class="ingresar-acciones">
              <a class="ingresar-btn primary" routerLink="/admin/login">Ingresar al panel</a>
            </div>
            <p class="ingresar-nota">Acceso exclusivo para el equipo de Adopta Huellitas.</p>
          </article>
        </div>
      </section>

      <footer class="ingresar-footer">
        <span>+57 3136410020</span>
        <span>ag123angie1@gmail.com</span>
        <span>Pasto, Nariño, Colombia</span>
      </footer>
    </main>
  `,
  styles: [
    `
      .ingresar-page { min-height: 100vh; display: flex; flex-direction: column; background: linear-gradient(160deg, #eef7f2 0%, #f8fbfa 45%, #e6f1ec 100%); color: #17332c; font-family: inherit; }
      .ingresar-topbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px clamp(20px, 6vw, 70px); border-bottom: 1px solid rgba(23,51,44,.08); }
      .ingresar-brand { display: inline-flex; align-items: center; gap: 10px; color: #17332c; text-decoration: none; font-size: 17px; }
      .ingresar-brand img { width: 42px; height: 42px; object-fit: contain; }
      .ingresar-volver { color: #3f7a68; font-size: 13px; font-weight: 700; text-decoration: none; }
      .ingresar-volver:hover { text-decoration: underline; }
      .ingresar-hero { flex: 1; width: min(960px, calc(100% - 40px)); margin: 0 auto; padding: clamp(48px, 8vw, 90px) 0; text-align: center; }
      .ingresar-eyebrow { margin: 0 0 12px; color: #3f7a68; font-size: 11px; font-weight: 800; letter-spacing: .16em; }
      .ingresar-hero h1 { margin: 0; font-size: clamp(30px, 5vw, 46px); line-height: 1.12; }
      .ingresar-lead { max-width: 620px; margin: 16px auto 38px; color: #667975; font-size: 15px; line-height: 1.7; }
      .ingresar-opciones { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; text-align: left; }
      .ingresar-card { padding: 30px; border: 1px solid rgba(255,255,255,.9); border-radius: 20px; background: rgba(255,255,255,.68); box-shadow: 0 18px 50px rgba(29,73,60,.10); backdrop-filter: blur(14px); }
      .ingresar-card.admin { border-color: rgba(63,122,104,.32); }
      .ingresar-icono { display: inline-grid; place-items: center; width: 50px; height: 50px; border-radius: 15px; background: #e3f2ea; font-size: 24px; }
      .ingresar-card.admin .ingresar-icono { background: #dceaf7; }
      .ingresar-card h2 { margin: 18px 0 8px; font-size: 22px; }
      .ingresar-card p { margin: 0; color: #667975; font-size: 14px; line-height: 1.6; }
      .ingresar-acciones { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
      .ingresar-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 42px; padding: 0 18px; border: 1px solid #17332c; border-radius: 9px; background: #17332c; color: #fff; font: inherit; font-size: 13px; font-weight: 700; text-decoration: none; cursor: pointer; }
      .ingresar-btn.outline { background: transparent; color: #17332c; }
      .ingresar-btn.primary { background: #2f8f6b; border-color: #2f8f6b; }
      .ingresar-btn:disabled { opacity: .45; cursor: not-allowed; }
      .ingresar-nota { margin-top: 16px !important; font-size: 12px !important; color: #8a9995 !important; }
      .ingresar-footer { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px 22px; padding: 20px; border-top: 1px solid rgba(23,51,44,.08); color: #667975; font-size: 12px; }
      @media (max-width: 720px) {
        .ingresar-opciones { grid-template-columns: 1fr; }
        .ingresar-card { padding: 24px; }
        .ingresar-topbar { align-items: flex-start; flex-direction: column; }
      }
    `,
  ],
})
export class IngresarComponent {}
