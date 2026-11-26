import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { API_BASE_URL } from './api.service';

interface Sesion {
  access: string;
  refresh: string;
  username: string;
}

const CLAVE_SESION = 'adopta_sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  get sesion(): Sesion | null {
    const guardado = localStorage.getItem(CLAVE_SESION);
    if (!guardado) {
      return null;
    }
    try {
      return JSON.parse(guardado) as Sesion;
    } catch {
      localStorage.removeItem(CLAVE_SESION);
      return null;
    }
  }

  get token(): string | null {
    return this.sesion?.access ?? null;
  }

  get username(): string {
    return this.sesion?.username ?? 'Administración';
  }

  isLoggedIn(): boolean {
    return Boolean(this.token);
  }

  login(username: string, password: string): Observable<void> {
    return this.http
      .post<{ access: string; refresh: string }>(`${API_BASE_URL}/token/`, {
        username,
        password,
      })
      .pipe(
        map((tokens) => ({
          access: tokens.access,
          refresh: tokens.refresh,
          username,
        })),
        tap((sesion) => localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))),
        map(() => undefined),
      );
  }

  logout(): void {
    localStorage.removeItem(CLAVE_SESION);
    this.router.navigateByUrl('/admin/login');
  }
}
