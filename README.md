# Adopta Huellitas

Plataforma Full Stack para gestionar rescates, adopciones responsables, historial médico y seguimiento post-adopción durante 24 meses.

## Arquitectura

- **Backend:** Python 3.11+, Django 5.1 y Django REST Framework.
- **Frontend:** Angular 21 con componentes standalone.
- **Base de datos:** SQLite en desarrollo y PostgreSQL opcional en producción.
- **Evidencias:** archivos locales de imagen o URL externas.
- **Entorno:** Windows PowerShell, Visual Studio Code y Git.

## Requisitos previos

Instala antes de ejecutar el proyecto:

- Python 3.11 o superior.
- Node.js 20 o superior.
- npm.
- Angular CLI.
- Git.
- PostgreSQL solo si se utilizará como base de datos de producción.

## Importar el proyecto

### 1. Descargar el repositorio

```powershell
git clone <URL-DEL-REPOSITORIO>
cd "DW trabajo final"
```

### 2. Configurar el backend

Desde la raíz del proyecto:

```powershell
py -3.13 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend disponible en: `http://127.0.0.1:8000/`  
Administrador Django: `http://127.0.0.1:8000/admin/`

Si PowerShell bloquea la activación del entorno, ejecuta una vez:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 3. Configurar el frontend

En otra terminal:

```powershell
cd frontend
npm install
npm start
```

Frontend disponible en: `http://localhost:4200/`

## Comandos útiles

### Django

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py test
python manage.py collectstatic
python manage.py runserver
```

### Angular

```powershell
cd frontend
npm start
npm run build
npm test
ng generate component nombre-componente
ng generate service servicios/nombre-servicio
```

## Funciones previstas

1. Catálogo público con filtros por especie y tamaño.
2. Registro y edición de mascotas.
3. Validación de microchip con formato `CHIP-XXXX-XXXXX`.
4. Historial clínico por mascota.
5. Solicitudes de adopción.
6. Generación automática de 15 reportes durante 24 meses al aprobar una adopción.
7. Evidencias locales o mediante URL externa.
8. Auditoría y semáforo de seguimiento por parte del refugio.

## Estructura del proyecto

```text
DW trabajo final/
├── .venv/                 Entorno virtual de Python
├── adopciones/            Aplicación Django principal
├── config/                Configuración global de Django
├── frontend/              Aplicación Angular
├── media/                 Archivos multimedia subidos
├── manage.py              Punto de entrada de Django
├── requirements.txt        Dependencias del backend
└── README.md               Esta documentación
```

## Archivos que no deben subirse a Git

- `.venv/`
- `node_modules/`
- `.env`
- `db.sqlite3`
- `media/`
- `dist/`
- archivos temporales de caché y compilación

## Próximos módulos

- Configurar Django REST Framework y CORS.
- Crear los modelos de mascotas, historial médico, solicitudes y seguimiento.
- Configurar serializadores, vistas y rutas REST.
- Implementar las cuatro interfaces Angular previstas.
- Crear datos de prueba y ejecutar pruebas automatizadas.
