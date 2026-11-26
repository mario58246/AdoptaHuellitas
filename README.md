# Adopta Huellitas

Plataforma Full Stack para gestionar rescates, adopciones responsables, historial médico y seguimiento post-adopción durante 24 meses (15 reportes).

## Arquitectura

- **Backend:** Python 3.11+, Django 5.1 y Django REST Framework + SimpleJWT.
- **Frontend:** Angular 19+ (actualmente 21) con componentes standalone + Tailwind CSS + CSS3 (Glassmorphism).
- **Base de datos:** SQLite en desarrollo; PostgreSQL en Supabase mediante `DATABASE_URL` en producción.
- **Archivos:** locales en `/media/` durante desarrollo; Cloudinary en producción + URLs externas (Drive/YouTube).
- **Despliegue:** Render (API) y Vercel (SPA).

## Estructura del repositorio

```text
AdoptaHuellitas/
├── .env.example
├── .gitignore
├── README.md
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/            # settings.py, urls.py, asgi.py, wsgi.py
│   └── adopciones/        # modelos, serializers, views, services, tests
└── frontend/              # Angular + Tailwind
    └── src/
```

## Configuración local (Windows / PowerShell)

### 1. Clonar y crear entorno

```powershell
git clone https://github.com/mario58246/AdoptaHuellitas.git
cd AdoptaHuellitas
py -3.13 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
```

Si PowerShell bloquea la activación:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 2. Variables de entorno

```powershell
Copy-Item .env.example .env
```

En local dejar `DATABASE_URL=` y `CLOUDINARY_URL=` vacíos para usar SQLite y archivos locales.

### 3. Backend

```powershell
cd backend
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API: `http://127.0.0.1:8000/api/` · Admin: `http://127.0.0.1:8000/admin/`

### 4. Frontend (otra terminal)

```powershell
cd frontend
npm install
npm start
```

SPA: `http://localhost:4200/`

## Endpoints principales

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/token/` | Obtener access + refresh token | Público |
| POST | `/api/token/refresh/` | Renovar access token | Público |
| GET/POST | `/api/mascotas/` | Catálogo / alta de mascotas | Público / Admin |
| GET | `/api/mascotas/?especie=Perro&tamaño=Mediano` | Filtros combinatorios | Público |
| GET/POST | `/api/historial-medico/` | Ficha clínica | Público / Admin |
| POST | `/api/solicitudes/` | Enviar postulación | Adoptante |
| POST | `/api/solicitudes/{id}/aprobar/` | Aprobar y generar 15 reportes | Admin |
| POST | `/api/solicitudes/{id}/rechazar/` | Rechazar solicitud | Admin |
| PATCH | `/api/seguimientos/{id}/enviar-evidencia/` | Cargar archivo o URL | Adoptante |
| POST | `/api/seguimientos/{id}/aprobar/` | Validar evidencia | Admin |
| POST | `/api/seguimientos/{id}/solicitar-correccion/` | Pedir corrección | Admin |

## Reglas de negocio ya implementadas

- Microchip corporativo con formato obligatorio `CHIP-XXXX-XXXXX` (HTTP 400 si falla).
- Al aprobar una solicitud, en una transacción atómica: mascota → `Adoptado` y se crean los 15 reportes (meses 1-12 y 16, 20, 24).
- Semáforo calculado: verde (Aprobado), azul (En Revisión), amarillo (Pendiente en plazo), rojo (Vencido).
- Carga híbrida de evidencias: archivo local/Cloudinary o URL externa.

## Flujo de trabajo (GitHub Flow)

```powershell
git checkout main
git pull origin main
git checkout -b feature/admin-crud-mascotas
git add .
git commit -m "feat(admin): crea endpoint para registrar microchip de mascota"
git push -u origin feature/admin-crud-mascotas
```

- Prohibido hacer commit directo a `main`.
- Todo `feature/*` se integra mediante Pull Request con 1 aprobación del compañero.
- Commits en formato Conventional Commits: `feat`, `fix`, `style`, `docs`.

## Reparto de roles

- **Angie (Administrador):** CRUD de mascotas, bandeja de solicitudes, auditoría/semáforo de seguimiento e historial médico.
- **Mario (Visitante + Adoptante):** landing, catálogo, autenticación JWT, formulario de postulación y portal del adoptante.

## Referencias de diseño

- `interfaces ejemplo/`: CSS exportado de los wireframes (panel administrativo, seguimiento con semáforo, catálogo, etc.).
- `Adopta Huellitas.fig`: archivo original de Figma.
