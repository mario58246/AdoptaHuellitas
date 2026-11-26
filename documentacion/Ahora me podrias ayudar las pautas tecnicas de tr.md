Aquí tienes la **Guía de Pautas Técnicas y Estándares de Trabajo** para compartir con Mario. Este documento define la arquitectura de carpetas, el flujo en GitHub Flow, las herramientas aprobadas, el estándar de código y la guía de prompts para que sus asistentes de IA trabajen en total sintonía. 

# **Pautas Técnicas y Estándar de Trabajo (Adopta �** 🛠️� **Huellitas)** 

## **1. Stack de Herramientas Aprobadas** 

- **Backend:** Python 3.11+ / Django REST Framework (DRF) + djangorestframeworksimplejwt 

- **Frontend:** Node.js (LTS) / Angular 19+ + Tailwind CSS + CSS3 (Glassmorphism) 

- **Base de Datos:** PostgreSQL en **Supabase** (SQLite para desarrollo local rápido) 

- **Almacenamiento de Archivos: Cloudinary** (vía django-cloudinary-storage) + URLs externas (Google Drive/YouTube) 

- **Hosting: Vercel** (Frontend) + **Render** (Backend) 

## **2. Estructura del Repositorio (Monorepo)** 

El repositorio AdoptaHuellitas.git mantendrá la siguiente estructura en la rama main: 



<!-- Start of picture text -->
Plaintext<br>AdoptaHuellitas/<br>├── .gitignore            # Excluye venv/, node_modules/, *.sqlite3, .env<br>├── README.md             # Documentación general y comandos de arranque<br>├── backend/              # Proyecto Django REST Framework<br>│├── manage.py<br>│├── requirements.txt<br>│├── core/             # Conf i guración principal (setings.py, urls.py) t<br>│└── apps/             # Aplicaciones (mascotas, adopciones, seguimiento, medicos)<br>└── frontend/             # Proyecto Angular 19+<br>├── package.json<br>├── angular.json<br>└── src/<br>├── app/<br>│├── core/     # Guards, Interceptors, Servicios globales<br>│├── shared/   # Componentes UI reutilizables (Navbar, Cards, Modales)<br>│└── modules/  # Módulos por Rol (admin/, public/, adoptante/)<br>└── assets/<br><!-- End of picture text -->

## **3. Flujo en GitHub (GitHub Flow Simplificado)** 

### **Reglas de Ramas:** 

1. **main** : Rama sagrada de código estable desplegada automáticamente en Vercel y Render. **Prohibido hacer git commit directo a main.** 

2. **feature/<rol>-<modulo>** : Ramas de trabajo individual de corta duración. 

- _Ramas de Angie (Admin):_ feature/admin-crud-mascotas, feature/admin-aprobacionsolicitudes, feature/admin-semaforo-seguimiento. 

- _Ramas de Mario (Público/Adoptante):_ feature/publico-catalogo-glass, feature/adoptante-auth-jwt, feature/adoptante-portal-seguimiento. 

### **Ciclo de Trabajo Diario (Comandos):** 



<!-- Start of picture text -->
Bash<br># 1. Posicionarse en main y descargar lo último integrado por el compañero<br>git checkout main<br>git pull origin main<br># 2. Crear y cambiar a la rama de la tarea a desarrollar<br>git checkout -b feature/admin-crud-mascotas<br># 3. Guardar cambios en commits pequeños<br>git add .<br>git commit -m "feat(admin): crea endpoint para registrar microchip de mascota"<br># 4. Subir la rama a GitHub<br>git push -u origin feature/admin-crud-mascotas<br><!-- End of picture text -->

### **Protocolo de Pull Request (PR):** 

- Al finalizar la tarea en GitHub, se abre un **Pull Request** hacia main. 

- Se requiere **1 aprobación escrita del otro compañero** en GitHub antes de presionar _Merge_ . 

## **4. Estándar de Commits (Conventional Commits)** 

Para que el historial del proyecto sea claro y los agentes de IA entiendan los cambios anteriores, usaremos el prefijo correspondiente: 

- feat(...): Nueva funcionalidad. _(Ej: feat(adoptante): agrega linea de tiempo de 15 reportes)_ 

- fix(...): Corrección de un error. _(Ej: fix(admin): corrige calculo de alerta en semaforo)_ 

- style(...): Cambios estéticos de CSS/Tailwind sin alterar lógica. _(Ej: style(publico): ajusta efecto glassmorphism en buscador)_ 

- docs(...): Actualización de documentación. _(Ej: docs: actualiza contrato JSON de mascotas)_ 

## **💡 Guía para la Interacción con Agentes de IA** 

**Prompt Estructurado** al pedir ayuda: 

**Prompt Base para pedir código a la IA:** 

_"Estoy trabajando en el proyecto_ **_Adopta Huellitas_** _(Monorepo Django REST Framework + Angular 19+). Mi rol asignado es_ **_[Tu Rol: Administrador O Usuario/Adoptante]_** _. Reglas de contexto:_ 

1. _Backend en /backend usando Django REST + PostgreSQL (Supabase) + Cloudinary._ 

2. _Frontend en /frontend usando Angular 19 + Tailwind CSS + Glassmorphism._ 

3. _Usa autenticación stateless con SimpleJWT (Bearer <token>)._ 

4. _No modifiques la estructura de modelos compartida en Django; solo genera la lógica para la app de mi rol._ 

_Necesito que me ayudes a construir [Describir la función o pantalla requerida]. Dame el código separado por archivos y listo para colocar en la carpeta correspondiente."_ 

