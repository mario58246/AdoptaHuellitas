import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { API_BASE_URL } from './api.service';

interface Sesion {
  access: string;
  refresh: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isStaff: boolean;
}

export interface RegistroAdoptante {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirmacion: string;
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

  get nombre(): string {
    const sesion = this.sesion;
    return [sesion?.firstName, sesion?.lastName].filter(Boolean).join(' ') || this.username;
  }

  get email(): string {
    return this.sesion?.email ?? '';
  }

  isLoggedIn(): boolean {
    return Boolean(this.token);
  }

  isAdmin(): boolean {
    return this.sesion?.isStaff === true;
  }

  login(username: string, password: string): Observable<void> {
    return this.http
      .post<{
        access: string;
        refresh: string;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        is_staff: boolean;
      }>(`${API_BASE_URL}/token/`, {
        username,
        password,
      })
      .pipe(
        map((tokens) => ({
          access: tokens.access,
          refresh: tokens.refresh,
          username: tokens.username,
          firstName: tokens.first_name,
          lastName: tokens.last_name,
          email: tokens.email,
          isStaff: tokens.is_staff,
        })),
        tap((sesion) => localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))),
        map(() => undefined),
      );
  }

  registrar(datos: RegistroAdoptante): Observable<void> {
    return this.http.post(`${API_BASE_URL}/usuarios/registro/`, datos).pipe(map(() => undefined));
  }

  clearSession(): void {
    localStorage.removeItem(CLAVE_SESION);
  }

  logout(): void {
    this.clearSession();
    this.router.navigateByUrl('/admin/login');
  }
}
