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
│   └── adopciones/        # modelos, serializers, views, services, tests y comandos de purga
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

SPA: `http://localhost:4200/` · Accesos: `http://localhost:4200/ingresar` · Panel: `http://localhost:4200/admin`

## Endpoints principales

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/token/` | Obtener access + refresh token | Público |
| POST | `/api/token/refresh/` | Renovar access token | Público |
| GET/POST | `/api/mascotas/` | Catálogo / alta de mascotas | Público / Admin |
| GET | `/api/mascotas/?especie=Perro&tamaño=Mediano` | Filtros combinatorios | Público |
| GET | `/api/mascotas/bajas/` | Listado de mascotas fallecidas | Admin |
| PATCH | `/api/mascotas/{id}/` | Editar ficha o cambiar estado (en Bajas solo estado) | Admin |
| GET/POST | `/api/historial-medico/` | Ficha clínica | Público / Admin |
| POST | `/api/solicitudes/` | Enviar postulación | Adoptante |
| POST | `/api/solicitudes/{id}/aprobar/` | Aprobar y generar 15 reportes | Admin |
| POST | `/api/solicitudes/{id}/rechazar/` | Rechazar solicitud | Admin |
| PATCH | `/api/seguimientos/{id}/enviar-evidencia/` | Cargar archivo o URL | Adoptante |
| POST | `/api/seguimientos/{id}/aprobar/` | Validar evidencia | Admin |
| POST | `/api/seguimientos/{id}/solicitar-correccion/` | Pedir corrección | Admin |

## Reglas de negocio ya implementadas

- Microchip con norma **ISO 11784/11785**: exactamente 15 dígitos numéricos, sin letras ni guiones (ejemplo `981000123456789`). HTTP 400 si falla. Los chips antiguos `CHIP-XXXX-XXXXX` se convierten automáticamente en la migración `0002`.
- Al aprobar una solicitud, en una transacción atómica: mascota → `Adoptado` y se crean los 15 reportes (meses 1-12 y 16, 20, 24).
- Semáforo calculado: verde (Aprobado), azul (En Revisión), amarillo (Pendiente en plazo), rojo (Vencido).
- Carga híbrida de evidencias: archivo local/Cloudinary o URL externa.
- **Bajas:** no hay borrado directo (`DELETE` devuelve 405). Al pasar a `Fallecido` se registra `fecha_baja`; la mascota desaparece del catálogo, solicitudes, historial y seguimiento, pero su información se conserva en `/admin/bajas`. En esa sección solo se puede cambiar el estado.
- **Retención:** a los 5 años de la baja se elimina la mascota junto con solicitudes, 15 reportes e historial médico. La purga se ejecuta al consultar mascotas y también con `python manage.py purgar_bajas` (programable con cron).

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

- **Angie (Administrador):** CRUD de mascotas, bajas y reactivaciones, bandeja de solicitudes, auditoría/semáforo de seguimiento e historial médico.
- **Mario (Visitante + Adoptante):** landing, catálogo, autenticación JWT, formulario de postulación y portal del adoptante.

## Módulo administrador (Angie)

Panel en **`http://localhost:4200/admin`**. La landing pública sigue en `http://localhost:4200/`.

- Ingresá con el superusuario creado en local (`admin`) y su contraseña.
- Si no tenés superusuario: `cd backend && python manage.py createsuperuser`.
- El token JWT se guarda en `localStorage` (`adopta_sesion`) y se envía automáticamente en cada petición.
- Pantallas: Resumen, Mascotas (alta/edición + microchip ISO, sin borrado), **Bajas** (solo cambio de estado), Solicitudes (aprobar/rechazar), Seguimiento (matriz de 15 reportes y semáforo) e Historial médico.
- La landing pública toma las mascotas `Disponible` desde la API y muestra **máximo 20 fichas**; si hay más, invita a ingresar para ver el catálogo completo.
- Si una mascota no tiene imagen cargada, se usan los vectores grises semitransparentes de `frontend/public/assets/mascotas/` según su especie. La imagen del hero solo se usa en “Un hogar cambia una vida”.
- En el alta/edición de mascotas se puede subir una foto real desde el equipo o usar una URL externa. El archivo se envía como `multipart/form-data` y se sirve desde `/media/`; la API devuelve la URL absoluta para que la imagen aparezca en el panel y en la landing. En producción, Cloudinary reemplaza al almacenamiento local.
- `http://localhost:4200/ingresar` muestra las opciones de adoptante (pendiente del módulo de Mario) y administrador (redirige al login del panel).
- La barra lateral muestra los iconos y sus etiquetas; el login permite mostrar u ocultar la contraseña.
- La URL de la API está en `frontend/src/app/core/services/api.service.ts` (`API_BASE_URL`); cámbiala por la de Render al desplegar.

Estructura del frontend:

```text
frontend/src/app/
├── core/          # modelos, ApiService, AuthService, interceptor y guard
├── modules/admin/ # shell, rutas, estilos y páginas del panel
├── modules/public/# pantalla de accesos (/ingresar)
├── app.ts         # landing pública de Mario (catálogo cargado desde la API)
└── app-shell.ts   # raíz con <router-outlet>
```

## Referencias de diseño

- `interfaces ejemplo/`: CSS exportado de los wireframes (panel administrativo, seguimiento con semáforo, catálogo, etc.).
- `Adopta Huellitas.fig`: archivo original de Figma.

## Contacto

- **Contáctenos:** +57 3136410020
- **Correo:** ag123angie1@gmail.com
- **Ubicación:** Pasto, Nariño, Colombia

Estos datos son los oficiales del refugio y se muestran en el pie de la landing pública.
